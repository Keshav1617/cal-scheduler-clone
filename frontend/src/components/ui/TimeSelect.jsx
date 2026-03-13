import { Fragment, useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const h24 = String(hour).padStart(2, '0');
      const m = String(minute).padStart(2, '0');
      const time24 = `${h24}:${m}`;
      
      const period = hour >= 12 ? 'pm' : 'am';
      const h12 = hour % 12 || 12;
      const display = `${h12}:${m}${period}`;
      
      options.push({ value: time24, display });
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

export default function TimeSelect({ value, onChange, className }) {
  // Normalize value (HH:MM:SS or HH:MM)
  const normalizedValue = value ? value.substring(0, 5) : '09:00';
  const selected = timeOptions.find(opt => opt.value === normalizedValue) || timeOptions[0];

  return (
    <Listbox value={normalizedValue} onChange={onChange}>
      <div className={clsx("relative", className)}>
        <Listbox.Button className="relative w-26 cursor-default rounded-lg border border-zinc-800 bg-black py-2 pl-3 pr-8 text-center text-[13px] font-medium text-white shadow-sm focus:outline-none focus:border-zinc-500 transition-all hover:border-zinc-700">
          <span className="block whitespace-nowrap">{selected.display}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown className="h-4 w-4 text-zinc-600" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-36 overflow-auto rounded-xl bg-zinc-900 py-1.5 text-[13px] shadow-2xl ring-1 ring-white/10 focus:outline-none scrollbar-hide border border-zinc-800">
            {timeOptions.map((option) => (
              <Listbox.Option
                key={option.value}
                className={({ active, selected }) =>
                  clsx(
                    'relative cursor-default select-none py-1.5 pl-7 pr-2 transition-colors',
                    active ? 'bg-zinc-800 text-white' : 'text-zinc-400',
                    selected && 'text-white font-bold'
                  )
                }
                value={option.value}
              >
                {({ selected }) => (
                  <>
                    <span className={clsx('block whitespace-nowrap', selected ? 'font-bold' : 'font-normal')}>
                      {option.display}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-white">
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
