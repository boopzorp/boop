
"use client"

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { Entry, EntryType } from "@/types";
import { cn } from '@/lib/utils';

type ShelfItemProps = {
  entry: Entry;
  isSelected: boolean;
  onOpenDetail: (entry: Entry) => void;
};

const typeStyles: Record<EntryType, {
    spineWidth: number,
    itemHeight: number,
    coverWidth: number,
    textVertical: boolean,
    spineBg: string,
    spineShadow: string
}> = {
    book: {
        spineWidth: 40,
        itemHeight: 350,
        coverWidth: 250,
        textVertical: true,
        spineBg: 'bg-primary',
        spineShadow: 'shadow-[inset_2px_0_5px_rgba(0,0,0,0.1),_inset_-1px_0_2px_rgba(255,255,255,0.3)]'
    },
    manga: {
        spineWidth: 40,
        itemHeight: 350,
        coverWidth: 250,
        textVertical: true,
        spineBg: 'bg-primary',
        spineShadow: 'shadow-[inset_2px_0_5px_rgba(0,0,0,0.1),_inset_-1px_0_2px_rgba(255,255,255,0.3)]'
    },
    movie: {
        spineWidth: 24,
        itemHeight: 320,
        coverWidth: 200,
        textVertical: true,
        spineBg: 'bg-primary',
        spineShadow: 'shadow-[inset_1px_0_3px_rgba(255,255,255,0.2),_inset_-1px_0_3px_rgba(0,0,0,0.4)]'
    },
    tv: {
        spineWidth: 24,
        itemHeight: 320,
        coverWidth: 200,
        textVertical: true,
        spineBg: 'bg-primary',
        spineShadow: 'shadow-[inset_1px_0_3px_rgba(255,255,255,0.2),_inset_-1px_0_3px_rgba(0,0,0,0.4)]'
    },
    anime: {
        spineWidth: 24,
        itemHeight: 320,
        coverWidth: 200,
        textVertical: true,
        spineBg: 'bg-primary',
        spineShadow: 'shadow-[inset_1px_0_3px_rgba(255,255,255,0.2),_inset_-1px_0_3px_rgba(0,0,0,0.4)]'
    },
    music: {
        spineWidth: 220, // Always show cover for music
        itemHeight: 220,
        coverWidth: 220,
        textVertical: true,
        spineBg: 'bg-primary',
        spineShadow: 'shadow-[inset_1px_0_2px_rgba(255,255,255,0.2),_inset_-1px_0_2px_rgba(0,0,0,0.5)]'
    },
    blog: {
        spineWidth: 320,
        itemHeight: 220,
        coverWidth: 320,
        textVertical: false,
        spineBg: 'bg-primary',
        spineShadow: 'shadow-[inset_1px_0_2px_rgba(255,255,255,0.2),_inset_-1px_0_2px_rgba(0,0,0,0.5)]'
    },
    apps: {
        spineWidth: 100,
        itemHeight: 100,
        coverWidth: 100,
        textVertical: false,
        spineBg: 'bg-transparent',
        spineShadow: ''
    }
}


export function ShelfItem({ entry, isSelected, onOpenDetail }: ShelfItemProps) {
  const { title, type } = entry;
  const styles = typeStyles[type];
  
  const itemVariants = {
    initial: {
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    hover: {
      y: -15,
      scale: 1.05,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  const handleCoverClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenDetail(entry);
  };
  
  const showCover = isSelected || type === 'music' || type === 'blog' || type === 'apps';

  if (type === 'apps') {
    return (
        <motion.div
            className="group relative flex-shrink-0 cursor-pointer flex flex-col items-center gap-2"
            style={{ 
                width: `${styles.coverWidth}px`, 
            }}
            variants={itemVariants}
            initial="initial"
            whileHover="hover"
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            onClick={handleCoverClick}
        >
            <div className="w-full relative shadow-lg" style={{ aspectRatio: '1 / 1' }}>
                <div
                    className="absolute inset-0 bg-secondary"
                    style={{
                        clipPath: 'path("M0,20 C0,5 5,0 20,0 L80,0 C95,0 100,5 100,20 L100,80 C100,95 95,100 80,100 L20,100 C5,100 0,95 0,80Z")'
                    }}
                 />
                <Image
                    src={entry.imageUrl}
                    alt={`Icon for ${title}`}
                    width={styles.coverWidth}
                    height={styles.itemHeight}
                    className="absolute inset-0 w-full h-full object-cover p-2"
                    style={{
                        clipPath: 'path("M0,20 C0,5 5,0 20,0 L80,0 C95,0 100,5 100,20 L100,80 C100,95 95,100 80,100 L20,100 C5,100 0,95 0,80Z")'
                    }}
                    data-ai-hint="app icon"
                />
            </div>
            <p className="text-xs font-semibold text-center truncate w-full">{title}</p>
        </motion.div>
    )
  }

  if (type === 'blog') {
    return (
        <motion.div
            className="group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-lg shadow-xl"
            style={{ 
                width: `${styles.coverWidth}px`, 
                height: `${styles.itemHeight}px`,
            }}
            variants={itemVariants}
            initial="initial"
            whileHover="hover"
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            onClick={handleCoverClick}
        >
            <Image
                src={entry.imageUrl}
                alt={`Cover for ${title}`}
                width={styles.coverWidth}
                height={styles.itemHeight}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-300 filter blur-sm group-hover:blur-none group-hover:scale-110"
                data-ai-hint={`${type} cover`}
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative h-full flex items-center justify-center text-center p-4">
                <h3 className="text-white text-2xl font-bold font-anton tracking-wide text-shadow-lg">{title}</h3>
            </div>
        </motion.div>
    )
  }

  if (type === 'music') {
    return (
        <motion.div
            className="group relative flex-shrink-0 cursor-pointer"
            style={{ 
                width: `${styles.coverWidth}px`, 
                height: `${styles.itemHeight}px`
            }}
            variants={itemVariants}
            initial="initial"
            whileHover="hover"
            animate={isSelected ? "hover" : "initial"}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            onClick={handleCoverClick}
        >
            <div 
                className={cn(
                    "relative w-full h-full rounded-md shadow-2xl transition-transform duration-300 ease-in-out group-hover:scale-105",
                )}
            >
                {/* CD Disc */}
                <div className={cn(
                    "absolute top-0 right-[-60px] w-[200px] h-[200px] rounded-full transition-transform duration-500 ease-out group-hover:translate-x-[-45px]",
                    "bg-zinc-800",
                    "bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_rgba(0,0,0,0.4)_40%,_rgba(255,255,255,0.1)_70%)]"
                )}>
                    <div className="absolute top-1/2 left-1/2 w-8 h-8 rounded-full bg-zinc-900 -translate-x-1/2 -translate-y-1/2" />
                </div>
                
                {/* Album Art */}
                <Image
                    src={entry.imageUrl}
                    alt={`Cover for ${title}`}
                    width={styles.coverWidth}
                    height={styles.itemHeight}
                    className="relative rounded-md object-cover w-full h-full border-2 border-white/20"
                    data-ai-hint={`${type} cover`}
                />
            </div>
        </motion.div>
    )
  }

  return (
    <motion.div
      className="group relative flex-shrink-0 cursor-pointer"
      style={{ 
        width: showCover ? `${styles.coverWidth}px` : `${styles.spineWidth}px`, 
        height: `${styles.itemHeight}px`
      }}
      variants={itemVariants}
      initial="initial"
      whileHover="hover"
      animate={isSelected ? "hover" : "initial"}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
    >
      <AnimatePresence>
        {showCover ? (
          <motion.div
            key="cover"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: type === 'music' ? 0 : 0.15 } }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
            className="absolute inset-0"
            onClick={handleCoverClick}
          >
            <Image
              src={entry.imageUrl}
              alt={`Cover for ${title}`}
              width={styles.coverWidth}
              height={styles.itemHeight}
              className={cn("rounded-md object-cover shadow-2xl w-full h-full", {
                'border-2 border-white/20': type === 'movie' || type === 'music' || type === 'anime' || type === 'manga'
              })}
              data-ai-hint={`${type} cover`}
            />
          </motion.div>
        ) : type === 'book' || type === 'anime' || type === 'manga' || type === 'movie' ? (
             <motion.div
                key="spine-image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                className={cn(
                    "absolute inset-0 overflow-hidden",
                    styles.spineShadow
                )}
            >
                <Image 
                    src={entry.imageUrl} 
                    alt={`${title} spine`}
                    width={styles.coverWidth}
                    height={styles.itemHeight}
                    className="h-full w-auto object-cover -translate-x-1/2 left-1/2 relative filter blur-sm brightness-50"
                />
                 <div className="absolute inset-0 flex items-center justify-center p-1 overflow-hidden">
                    <span
                        className="font-headline text-xs font-bold text-white/90"
                        style={{
                            writingMode: 'vertical-rl',
                            textOrientation: 'mixed',
                            transform: 'rotate(180deg)',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            maxHeight: '100%',
                            textShadow: '0 0 4px rgba(0,0,0,0.8)'
                        }}
                    >
                    {title}
                    </span>
                 </div>
            </motion.div>
        ) : (
          <motion.div
            key="spine"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.05 } }}
            className={cn(
                "absolute inset-0 flex items-center p-1 overflow-hidden", 
                styles.spineBg, 
                styles.spineShadow
            )}
          >
            <span
              className={cn("font-headline text-sm font-bold", {
                'text-primary-foreground': type === 'book',
                'text-white/90': type === 'movie' || type === 'music' || type === 'blog' || type === 'anime' || type === 'manga'
              })}
              style={{
                writingMode: styles.textVertical ? 'vertical-rl' : 'undefined',
                textOrientation: styles.textVertical ? 'mixed' : undefined,
                transform: styles.textVertical ? 'rotate(180deg)' : 'none',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                maxHeight: '100%',
                padding: type === 'book' ? '10px 0' : (type === 'movie' ? '10px 0' : '10px 0'),
                textAlign: type === 'music' ? 'center' : (type === 'movie' ? 'center' : 'center'),
                width: '100%'
              }}
            >
              {title}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
