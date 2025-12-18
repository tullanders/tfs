'use client';
import { TdsBreadcrumbs, TdsBreadcrumb } from "@scania/tegel-react";
import { Breadcrumb } from "@/lib/types";

interface BreadcrumbsProps {
  items: Breadcrumb[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <TdsBreadcrumbs>
      {items.map((item, index) => (
        <TdsBreadcrumb key={index} current={item.current}>
          <a href={item.href}>{item.label}</a>
        </TdsBreadcrumb>
      ))}
    </TdsBreadcrumbs>
  );
}