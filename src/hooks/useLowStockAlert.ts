import { useState, useEffect, useCallback, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, getSetting, updateSetting } from '@/db/database';
import { toSafeQuantity } from '@/utils/safeNumber';

interface LowStockAlertState {
  hasLowStock: boolean;
  lowStockCount: number;
  isAlertAcknowledged: boolean;
  acknowledgeAlert: () => Promise<void>;
  resetAcknowledgement: () => Promise<void>;
  soundPlayed: boolean;
}

// Warning sound data URL (short beep)
const WARNING_SOUND_DATA = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleVsYgOC/pIFiT0mNu9CfYi4JQJPNwZ2BamNdhrLHnWU3HFOQvMagfXdvZYq0xp5nPCJajbTFpYqEfHOLr8KYZj8mYJG1xKWNiIR4i6W9kGM+K2iYusOnkYqEeImgrJJiPy9smr3BpJKLhniGma2RYD8zcJy/wKOTjId6g5WqkV5AM3Kdv76ik42He4GSnJFePDVznr+9oZONiHyAj5iRXjs4dZ+/vKCTjoh9fo2Wkl06O3efv7ugk46IfnyMlJNdOjx4oL+6oJOPiX98i5OUXTk9eKC/uZ+UkIl/e4qSlV05PnigwLiekZCKgHqJkZZdOT95ocC3npGRi4F5h5CXXjg/eaLBtp6RkYyCeYaOl144QHmiwrWdkZKMgniFjZdfOEB5o8O0nZGSjYN4g4yXYDdBeaTDtJ2RkoyDeYOLl2A3QXqkxLOdkZONg3mCipeAN0F6pMSznZGTjYR4gYmYgDdBeqXFsp2Rk42EeICImIA3QXqlxbGdkZSNhHh/h5mAN0B6psaxnZGUjoR4foeagDdAe6bGsZySlY6FeH6GmoA3QHumxrGckpWOhXh9hZqAN0B7p8axnJKVjoZ4fYSagDdAe6fHsJySlY+GeHyDm4E2QHunyK+ckpaPhnh8gpuBNkB8qMivnJKWj4d4e4GbgTZAfKjIrpySlpCHeHqAm4E2QHyoyK6ckZaQh3l6gJyBNT98qcmunJGWkId5eX+cgTU/fKnJrpyRl5CIeXl+nIE1P3ypya2ckZeQiHl4fp2BNT98qsqtnJGXkYh5eH2dgTU/fKrKrJyRmJGIeXd8nYE1P32qyqyckZiRiXl3fJ6CNT99qsqsnJGYkol5dnyegjQ/farLq5yRmJKJeXV7noI0P32qy6uckpmSinl1ep+CND99qsyrnJKZkop6dHqfgjQ+fqvMq5ySmZOKenR5n4I0Pn6rzKqckpmTi3pzeZ+DND5+q8yqnJKZk4t6c3igg';

let audioContext: AudioContext | null = null;

export function useLowStockAlert(): LowStockAlertState {
  const [isAlertAcknowledged, setIsAlertAcknowledged] = useState(false);
  const [soundPlayed, setSoundPlayed] = useState(false);
  const previousLowStockCount = useRef<number>(0);
  const hasPlayedInitialSound = useRef(false);

  // Live query for parts
  const parts = useLiveQuery(() => db.parts.toArray(), []) ?? [];

  // Calculate low stock count with safe number handling
  const lowStockCount = parts.filter(p => {
    const qty = toSafeQuantity(p.quantity, 0);
    const minStock = toSafeQuantity(p.minStockLevel, 0);
    return qty <= minStock;
  }).length;

  const hasLowStock = lowStockCount > 0;

  // Load acknowledgement state from database
  useEffect(() => {
    const loadAcknowledgement = async () => {
      const acknowledged = await getSetting<boolean>('lowStockAlertAcknowledged');
      const storedCount = await getSetting<number>('lowStockCountWhenAcknowledged');
      
      // Reset acknowledgement if there are new low stock items
      if (acknowledged && storedCount !== undefined) {
        if (lowStockCount > storedCount) {
          // New low stock items added, reset acknowledgement
          await updateSetting('lowStockAlertAcknowledged', false);
          setIsAlertAcknowledged(false);
        } else {
          setIsAlertAcknowledged(true);
        }
      } else {
        setIsAlertAcknowledged(!!acknowledged);
      }
    };
    loadAcknowledgement();
  }, [lowStockCount]);

  // Play warning sound
  const playWarningSound = useCallback(() => {
    try {
      const audio = new Audio(WARNING_SOUND_DATA);
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Audio playback failed (probably no user interaction yet)
        console.log('Audio playback requires user interaction');
      });
    } catch (error) {
      console.error('Failed to play warning sound:', error);
    }
  }, []);

  // Play sound on initial load or when new low stock items appear
  useEffect(() => {
    if (!hasLowStock || isAlertAcknowledged) {
      return;
    }

    // Play sound once on initial load if there are low stock items
    if (!hasPlayedInitialSound.current && lowStockCount > 0) {
      hasPlayedInitialSound.current = true;
      playWarningSound();
      setSoundPlayed(true);
    }

    // Play sound when low stock count increases
    if (lowStockCount > previousLowStockCount.current && previousLowStockCount.current > 0) {
      playWarningSound();
      setSoundPlayed(true);
    }

    previousLowStockCount.current = lowStockCount;
  }, [hasLowStock, lowStockCount, isAlertAcknowledged, playWarningSound]);

  // Acknowledge alert
  const acknowledgeAlert = useCallback(async () => {
    setIsAlertAcknowledged(true);
    await updateSetting('lowStockAlertAcknowledged', true);
    await updateSetting('lowStockCountWhenAcknowledged', lowStockCount);
  }, [lowStockCount]);

  // Reset acknowledgement (for testing or when user wants alerts again)
  const resetAcknowledgement = useCallback(async () => {
    setIsAlertAcknowledged(false);
    await updateSetting('lowStockAlertAcknowledged', false);
    await updateSetting('lowStockCountWhenAcknowledged', 0);
  }, []);

  return {
    hasLowStock,
    lowStockCount,
    isAlertAcknowledged,
    acknowledgeAlert,
    resetAcknowledgement,
    soundPlayed,
  };
}
