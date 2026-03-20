import type { LucideIcon } from "lucide-react";
import { Info } from "lucide-react";
import type { ReactNode } from "react";

type Tone = "purple" | "blue" | "green" | "amber";

const toneClasses: Record<Tone, string> = {
  purple: "border-purple-500/20 bg-purple-500/5 text-purple-200",
  blue: "border-blue-500/20 bg-blue-500/5 text-blue-200",
  green: "border-green-500/20 bg-green-500/5 text-green-200",
  amber: "border-amber-500/20 bg-amber-500/5 text-amber-200",
};

export const Inline = ({ children }: { children: ReactNode }) => (
  <code className="text-purple-300">{children}</code>
);

export const DocHeader = ({
  title,
  description,
}: {
  title: string;
  description: ReactNode;
}) => (
  <div className="mb-10">
    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
      {title}
    </h2>
    <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl">
      {description}
    </p>
  </div>
);

export const DocBlock = ({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}) => (
  <section id={id} className="mb-14 scroll-mt-28">
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    {description ? (
      <p className="text-gray-400 mb-5 leading-relaxed max-w-3xl">
        {description}
      </p>
    ) : null}
    {children}
  </section>
);

export const DocSubheading = ({ children }: { children: ReactNode }) => (
  <h4 className="text-lg font-bold text-purple-300 mb-3">{children}</h4>
);

export const DocFeatureGrid = ({
  items,
}: {
  items: {
    title: ReactNode;
    description: ReactNode;
    tone?: Tone;
  }[];
}) => (
  <div className="grid md:grid-cols-2 gap-4">
    {items.map((item, index) => (
      <div
        key={index}
        className={`rounded-2xl border p-5 ${
          toneClasses[item.tone ?? "purple"]
        }`}
      >
        <div className="font-semibold mb-2">{item.title}</div>
        <div className="text-sm leading-relaxed text-gray-300">
          {item.description}
        </div>
      </div>
    ))}
  </div>
);

export const DocRuleList = ({ items }: { items: ReactNode[] }) => (
  <ul className="space-y-2 pl-5 list-disc marker:text-purple-400 text-sm text-gray-400">
    {items.map((item, index) => (
      <li key={index} className="leading-relaxed">
        {item}
      </li>
    ))}
  </ul>
);

export const DocTable = ({
  headers,
  rows,
}: {
  headers: ReactNode[];
  rows: ReactNode[][];
}) => (
  <div className="overflow-x-auto rounded-2xl border border-white/10">
    <table className="w-full text-left text-sm border-collapse">
      <thead className="bg-white/[0.04]">
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="px-4 py-3 font-semibold text-gray-200">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="border-t border-white/10">
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className="px-4 py-3 align-top text-gray-400 leading-relaxed"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const DocCallout = ({
  title,
  children,
  tone = "blue",
  icon: Icon = Info,
}: {
  title: ReactNode;
  children: ReactNode;
  tone?: Tone;
  icon?: LucideIcon;
}) => (
  <div className={`rounded-2xl border p-5 ${toneClasses[tone]}`}>
    <div className="flex items-start gap-3">
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div>
        <div className="font-semibold mb-2">{title}</div>
        <div className="text-sm leading-relaxed text-gray-300">{children}</div>
      </div>
    </div>
  </div>
);
