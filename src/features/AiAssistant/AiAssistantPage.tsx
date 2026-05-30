import { useState, useRef, useEffect } from 'react';
import { sendChatMessage, type ChatMessage } from '../../api/ai';
import { MdSend, MdPets, MdDeleteOutline, MdAutoAwesome } from 'react-icons/md';
import {
  FaDog,
  FaCat,
  FaStethoscope,
  FaSearch,
} from 'react-icons/fa';

const CATEGORIES = [
  {
    icon: FaDog,
    label: 'Догляд за собакою',
    questions: ['Скільки разів виводити собаку на прогулянку?', 'Як доглядати за шерстю собаки?', 'Які щеплення потрібні цуценяті?'],
  },
  {
    icon: FaCat,
    label: 'Догляд за кішкою',
    questions: ['Чим годувати кішку?', 'Як привчити кішку до лотка?', 'Чому кішка не їсть?'],
  },
  {
    icon: FaStethoscope,
    label: 'Ветеринарія',
    questions: ['Які симптоми потребують лікаря?', 'Як часто робити щеплення?', 'Що робити при отруєнні улюбленця?'],
  },
  {
    icon: FaSearch,
    label: 'Пошук пет-сіттера',
    questions: ['Як обрати пет-сіттера?', 'Що перевірити у сіттера перед бронюванням?', 'Як підготувати улюбленця до сіттера?'],
  },
];

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-end">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zoopsy-green-600 to-zoopsy-green-800 flex items-center justify-center flex-shrink-0">
        <MdPets size={15} className="text-white" />
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1.5 items-center h-4">
          <span className="w-2 h-2 bg-zoopsy-green-500 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-zoopsy-green-500 rounded-full animate-bounce [animation-delay:160ms]" />
          <span className="w-2 h-2 bg-zoopsy-green-500 rounded-full animate-bounce [animation-delay:320ms]" />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-3 items-end ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zoopsy-green-600 to-zoopsy-green-800 flex items-center justify-center flex-shrink-0 mb-0.5">
          <MdPets size={15} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-[60%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-zoopsy-green-700 text-white rounded-2xl rounded-br-sm shadow-sm'
            : 'bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100'
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
}

export function AiAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: message };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(message, messages);
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Вибачте, сталася помилка зʼєднання. Спробуйте ще раз.' },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
    setInput('');
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">

      {/* ── Sidebar ── */}
      <aside className="w-72 flex-shrink-0 flex flex-col border-r border-gray-100 bg-white overflow-y-auto">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zoopsy-green-600 to-zoopsy-green-800 flex items-center justify-center">
              <MdAutoAwesome size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 leading-tight">Zoopsy AI</h2>
              <p className="text-xs text-gray-500">Асистент з питань про улюбленців</p>
            </div>
          </div>
        </div>

        {/* Info block */}
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-xs text-gray-500 leading-relaxed">
            Відповідаю на питання про догляд за улюбленцями, ветеринарію та пошук пет-сіттера. На інші теми не відповідаю.
          </p>
        </div>

        {/* Categories */}
        <div className="px-4 py-4 flex-1">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">
            Популярні теми
          </p>
          <div className="space-y-4">
            {CATEGORIES.map(({ icon: Icon, label, questions }) => (
              <div key={label}>
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  <Icon size={13} className="text-zoopsy-green-600" />
                  <span className="text-xs font-semibold text-gray-600">{label}</span>
                </div>
                <div className="space-y-1">
                  {questions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      disabled={isLoading}
                      className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-zoopsy-mint hover:text-zoopsy-green-700 rounded-lg transition-colors disabled:opacity-50 leading-snug"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clear */}
        {!isEmpty && (
          <div className="px-4 py-3 border-t border-gray-100">
            <button
              onClick={handleClear}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <MdDeleteOutline size={16} />
              Очистити чат
            </button>
          </div>
        )}
      </aside>

      {/* ── Main chat area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zoopsy-green-600 to-zoopsy-green-800 flex items-center justify-center shadow-lg">
                <MdPets size={30} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Привіт! Я Zoopsy AI</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Запитайте мене про догляд за улюбленцями, здоров'я вихованців або пошук пет-сіттера
                </p>
              </div>
              <p className="text-xs text-gray-400">← Оберіть питання з меню або напишіть своє</p>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
              ))}
              {isLoading && <TypingIndicator />}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-8 py-4 border-t border-gray-100 bg-white">
          <div className="flex items-end gap-3 bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3 focus-within:border-zoopsy-green-500 focus-within:bg-white transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Напишіть питання про вашого улюбленця... (Enter — надіслати, Shift+Enter — новий рядок)"
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-800 placeholder-gray-400 max-h-40 disabled:opacity-50 leading-relaxed"
              style={{ fieldSizing: 'content' } as React.CSSProperties}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-xl bg-zoopsy-green-700 hover:bg-zoopsy-green-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
            >
              <MdSend size={17} className="text-white" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            Zoopsy AI відповідає лише на теми про улюбленців та пошук пет-сіттерів
          </p>
        </div>
      </div>
    </div>
  );
}
