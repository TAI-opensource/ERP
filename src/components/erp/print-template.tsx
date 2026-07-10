"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PrinterIcon, DownloadIcon, XIcon } from "lucide-react"

interface CompanyInfo {
  name: string
  logo?: string
  address?: string[]
  phone?: string
  email?: string
  website?: string
  taxId?: string
}

interface DocumentInfo {
  number: string
  title: string
  date: string
  dueDate?: string
  reference?: string
  poNumber?: string
  status?: string
}

interface AddressInfo {
  name: string
  company?: string
  address?: string[]
  city?: string
  state?: string
  zip?: string
  country?: string
  phone?: string
  email?: string
  taxId?: string
}

interface LineItem {
  id: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
  discount?: number
  discountType?: "percentage" | "fixed"
  tax?: number
  taxType?: "percentage" | "fixed"
  total: number
  code?: string
  notes?: string
}

interface PrintTemplateProps {
  documentType: "invoice" | "quotation" | "purchase_order" | "receipt" | "delivery_note" | "credit_note" | "custom"
  documentNumber: string
  documentTitle?: string
  company: CompanyInfo
  document: DocumentInfo
  billingAddress?: AddressInfo
  shippingAddress?: AddressInfo
  lineItems: LineItem[]
  subtotal?: number
  discount?: number
  discountLabel?: string
  tax?: number
  taxLabel?: string
  shipping?: number
  shippingLabel?: string
  total: number
  currency?: string
  amountInWords?: string
  notes?: string
  terms?: string
  footer?: string
  paymentInfo?: { label: string; value: string }[]
  signatures?: { label: string; name?: string; signature?: string }[]
  customFields?: { label: string; value: string }[]
  showLogo?: boolean
  showHeader?: boolean
  showBillingAddress?: boolean
  showShippingAddress?: boolean
  showLineNumbers?: boolean
  showTax?: boolean
  showDiscount?: boolean
  showTotal?: boolean
  showAmountInWords?: boolean
  showNotes?: boolean
  showTerms?: boolean
  showFooter?: boolean
  showSignatures?: boolean
  className?: string
  contentClassName?: string
}

function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function PrintTemplate({
  documentType,
  documentNumber,
  documentTitle,
  company,
  document,
  billingAddress,
  shippingAddress,
  lineItems,
  subtotal,
  discount,
  discountLabel = "Discount",
  tax,
  taxLabel = "Tax",
  shipping,
  shippingLabel = "Shipping",
  total,
  currency = "USD",
  amountInWords,
  notes,
  terms,
  footer,
  paymentInfo,
  signatures,
  customFields,
  showLogo = true,
  showHeader = true,
  showBillingAddress = true,
  showShippingAddress = true,
  showLineNumbers = true,
  showTax = true,
  showDiscount = true,
  showTotal = true,
  showAmountInWords = true,
  showNotes = true,
  showTerms = true,
  showFooter = true,
  showSignatures = false,
  className,
  contentClassName,
}: PrintTemplateProps) {
  const contentRef = React.useRef<HTMLDivElement>(null)

  const defaultTitle = documentTitle ?? documentType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  const handlePrint = React.useCallback(() => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const content = contentRef.current?.innerHTML
    if (!content) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${defaultTitle} - ${documentNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 1.5; color: #1a1a1a; padding: 20mm; }
            @media print { body { padding: 0; } @page { margin: 15mm; } }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background: #f9fafb; font-weight: 600; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .font-bold { font-weight: 700; }
            .text-sm { font-size: 12px; }
            .text-xs { font-size: 10px; }
            .text-muted { color: #6b7280; }
            .mb-4 { margin-bottom: 16px; }
            .mb-6 { margin-bottom: 24px; }
            .mt-4 { margin-top: 16px; }
            .mt-8 { margin-top: 32px; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .items-start { align-items: flex-start; }
            .gap-4 { gap: 16px; }
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
            .w-full { width: 100%; }
            .border-t { border-top: 1px solid #e5e7eb; }
            .border-b { border-bottom: 1px solid #e5e7eb; }
            .p-2 { padding: 8px; }
            .p-4 { padding: 16px; }
            .rounded { border-radius: 4px; }
            .bg-gray-50 { background: #f9fafb; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }, [documentNumber, defaultTitle])

  const handleDownload = React.useCallback(() => {
    const content = contentRef.current?.innerHTML
    if (!content) return

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${defaultTitle} - ${documentNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 1.5; color: #1a1a1a; padding: 20mm; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background: #f9fafb; font-weight: 600; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .font-bold { font-weight: 700; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `

    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = window.document.createElement("a")
    a.href = url
    a.download = `${documentType}_${documentNumber}.html`
    a.click()
    URL.revokeObjectURL(url)
  }, [documentNumber, documentType, defaultTitle])

  const computedSubtotal = subtotal ?? lineItems.reduce((sum, item) => sum + item.total, 0)

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-2 print:hidden">
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <PrinterIcon className="mr-1.5 size-4" />
          Print
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <DownloadIcon className="mr-1.5 size-4" />
          Download
        </Button>
      </div>

      <div
        ref={contentRef}
        className={cn(
          "bg-white text-black shadow-sm ring-1 ring-border",
          "max-w-[210mm] mx-auto",
          contentClassName
        )}
      >
        <div className="p-8">
          {showHeader && (
            <div className="mb-8 flex items-start justify-between">
              <div className="flex items-start gap-4">
                {showLogo && company.logo && (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-12 w-auto object-contain"
                  />
                )}
                <div>
                  <h1 className="text-xl font-bold">{company.name}</h1>
                  {company.address && (
                    <div className="mt-1 text-sm text-gray-600">
                      {company.address.map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 text-sm text-gray-600">
                    {company.phone && <div>Tel: {company.phone}</div>}
                    {company.email && <div>Email: {company.email}</div>}
                    {company.website && <div>Web: {company.website}</div>}
                    {company.taxId && <div>Tax ID: {company.taxId}</div>}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <h2 className="text-2xl font-bold uppercase text-gray-800">{defaultTitle}</h2>
                <div className="mt-2 text-sm text-gray-600">
                  <div><span className="font-medium">Number:</span> {documentNumber}</div>
                  <div><span className="font-medium">Date:</span> {document.date}</div>
                  {document.dueDate && <div><span className="font-medium">Due Date:</span> {document.dueDate}</div>}
                  {document.reference && <div><span className="font-medium">Reference:</span> {document.reference}</div>}
                  {document.poNumber && <div><span className="font-medium">PO Number:</span> {document.poNumber}</div>}
                  {document.status && (
                    <div className="mt-1">
                      <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-medium uppercase">
                        {document.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {(showBillingAddress || showShippingAddress) && (
            <div className="mb-8 grid grid-cols-2 gap-8">
              {showBillingAddress && billingAddress && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">Bill To</h3>
                  <div className="text-sm">
                    <div className="font-medium">{billingAddress.name}</div>
                    {billingAddress.company && <div>{billingAddress.company}</div>}
                    {billingAddress.address && billingAddress.address.map((line, i) => <div key={i}>{line}</div>)}
                    {(billingAddress.city || billingAddress.state || billingAddress.zip) && (
                      <div>{[billingAddress.city, billingAddress.state, billingAddress.zip].filter(Boolean).join(", ")}</div>
                    )}
                    {billingAddress.country && <div>{billingAddress.country}</div>}
                    {billingAddress.phone && <div className="mt-1">Tel: {billingAddress.phone}</div>}
                    {billingAddress.email && <div>Email: {billingAddress.email}</div>}
                    {billingAddress.taxId && <div>Tax ID: {billingAddress.taxId}</div>}
                  </div>
                </div>
              )}

              {showShippingAddress && shippingAddress && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">Ship To</h3>
                  <div className="text-sm">
                    <div className="font-medium">{shippingAddress.name}</div>
                    {shippingAddress.company && <div>{shippingAddress.company}</div>}
                    {shippingAddress.address && shippingAddress.address.map((line, i) => <div key={i}>{line}</div>)}
                    {(shippingAddress.city || shippingAddress.state || shippingAddress.zip) && (
                      <div>{[shippingAddress.city, shippingAddress.state, shippingAddress.zip].filter(Boolean).join(", ")}</div>
                    )}
                    {shippingAddress.country && <div>{shippingAddress.country}</div>}
                    {shippingAddress.phone && <div className="mt-1">Tel: {shippingAddress.phone}</div>}
                    {shippingAddress.email && <div>Email: {shippingAddress.email}</div>}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  {showLineNumbers && <th className="w-8 text-center text-xs">#</th>}
                  {lineItems.some((item) => item.code) && <th className="text-xs">Code</th>}
                  <th className="text-xs">Description</th>
                  <th className="w-20 text-right text-xs">Qty</th>
                  {lineItems.some((item) => item.unit) && <th className="w-16 text-center text-xs">Unit</th>}
                  <th className="w-24 text-right text-xs">Unit Price</th>
                  {showDiscount && lineItems.some((item) => item.discount) && <th className="w-20 text-right text-xs">Disc.</th>}
                  <th className="w-24 text-right text-xs">Total</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, idx) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    {showLineNumbers && <td className="text-center text-gray-500">{idx + 1}</td>}
                    {lineItems.some((i) => i.code) && <td className="text-xs text-gray-500">{item.code ?? "-"}</td>}
                    <td>
                      <div className="font-medium">{item.description}</div>
                      {item.notes && <div className="text-xs text-gray-500">{item.notes}</div>}
                    </td>
                    <td className="text-right">{item.quantity}</td>
                    {lineItems.some((i) => i.unit) && <td className="text-center text-gray-500">{item.unit}</td>}
                    <td className="text-right">{formatCurrency(item.unitPrice, currency)}</td>
                    {showDiscount && lineItems.some((i) => i.discount) && (
                      <td className="text-right text-gray-500">
                        {item.discount ? `${item.discountType === "percentage" ? item.discount + "%" : formatCurrency(item.discount, currency)}` : "-"}
                      </td>
                    )}
                    <td className="text-right font-medium">{formatCurrency(item.total, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-8 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(computedSubtotal, currency)}</span>
              </div>
              {showDiscount && discount !== undefined && discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>{discountLabel}</span>
                  <span>-{formatCurrency(discount, currency)}</span>
                </div>
              )}
              {showTax && tax !== undefined && tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{taxLabel}</span>
                  <span>{formatCurrency(tax, currency)}</span>
                </div>
              )}
              {shipping !== undefined && shipping > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{shippingLabel}</span>
                  <span>{formatCurrency(shipping, currency)}</span>
                </div>
              )}
              {showTotal && (
                <>
                  <div className="border-t-2 border-gray-300 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(total, currency)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {showAmountInWords && amountInWords && (
            <div className="mb-6 text-sm text-gray-600">
              <span className="font-medium">Amount in words:</span> {amountInWords}
            </div>
          )}

          {paymentInfo && paymentInfo.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">Payment Information</h3>
              <div className="rounded border border-gray-200 bg-gray-50 p-3 text-sm">
                {paymentInfo.map((info, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-600">{info.label}</span>
                    <span className="font-medium">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {customFields && customFields.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-2 text-sm">
                {customFields.map((field, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-600">{field.label}:</span>
                    <span className="font-medium">{field.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showNotes && notes && (
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">Notes</h3>
              <p className="whitespace-pre-wrap text-sm text-gray-600">{notes}</p>
            </div>
          )}

          {showTerms && terms && (
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">Terms & Conditions</h3>
              <p className="whitespace-pre-wrap text-xs text-gray-500">{terms}</p>
            </div>
          )}

          {showSignatures && signatures && signatures.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-8">
              {signatures.map((sig, i) => (
                <div key={i}>
                  <div className="mb-1 text-sm font-semibold text-gray-500">{sig.label}</div>
                  <div className="h-16 border-b border-gray-300">
                    {sig.signature && <img src={sig.signature} alt={sig.label} className="h-full object-contain" />}
                  </div>
                  {sig.name && <div className="mt-1 text-xs text-gray-500">{sig.name}</div>}
                </div>
              ))}
            </div>
          )}

          {showFooter && footer && (
            <div className="mt-8 border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { PrintTemplate, formatCurrency, type PrintTemplateProps, type CompanyInfo, type DocumentInfo, type AddressInfo, type LineItem }
