import { useRef, useEffect, type DependencyList } from 'react';

/**
 * Chat scroll behaviour: auto-scroll to the bottom on new content, and on
 * open jump to the user's most recent message (falling back to the bottom).
 */
export function useChatScroll(isOpen: boolean, contentDeps: DependencyList) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastUserMsgRef = useRef<HTMLDivElement>(null);

  // `contentDeps` is the caller's trigger list, forwarded verbatim — the
  // standard generic-hook pattern. There is no static dependency to resolve
  // here; the caller owns correctness of what it passes.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, contentDeps);

  useEffect(() => {
    if (!isOpen) return;
    const id = setTimeout(() => {
      if (lastUserMsgRef.current) {
        lastUserMsgRef.current.scrollIntoView({
          behavior: 'auto',
          block: 'start'
        });
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }
    }, 50);
    return () => clearTimeout(id);
  }, [isOpen]);

  return { messagesEndRef, lastUserMsgRef };
}
