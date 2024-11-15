import { RefObject, useCallback, useState } from 'react';

export function useScroll(
  containerRef: RefObject<HTMLDivElement>,
  messagesEndRef: RefObject<HTMLDivElement>
) {
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior,
        block: 'end',
      });
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const distanceFromBottom = scrollHeight - clientHeight - scrollTop;
      setShowScrollButton(distanceFromBottom > 100);
    }
  }, []);

  return {
    showScrollButton,
    scrollToBottom,
    handleScroll,
  };
}