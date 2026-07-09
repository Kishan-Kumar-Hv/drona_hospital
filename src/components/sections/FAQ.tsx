import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Section, SectionHeader } from '../ui/Section';
import { useInView } from '../../hooks/useAnimation';
import { useTable } from '../../hooks/useContent';
import { FALLBACK_FAQS } from '../../data/fallbackContent';

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const { ref, isInView } = useInView(0.1);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${
        isInView
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium text-heading pr-8">{question}</span>
          <ChevronDown
            className={`w-5 h-5 text-muted transition-transform duration-300 flex-shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-96' : 'max-h-0'
          }`}
        >
          <div className="px-6 pb-5">
            <p className="text-muted leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const { data: faqs } = useTable('faqs', FALLBACK_FAQS);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section background="white" id="faq">
      <SectionHeader
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our services and processes."
      />
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem
            key={faq.id}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            index={index}
          />
        ))}
      </div>
    </Section>
  );
}
