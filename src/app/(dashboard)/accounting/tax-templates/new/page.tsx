"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import Link from "next/link"

export default function NewTaxTemplatePage() {
  return (
    <OverviewLayout
      title="New Tax Template"
      description="Create a new tax template"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Template Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input id="name" placeholder="e.g. ICMS Standard" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax">Tax Type</Label>
                <Select>
                  <option value="">Select tax type</option>
                  <option value="icms">ICMS</option>
                  <option value="ipi">IPI</option>
                  <option value="pis">PIS</option>
                  <option value="cofins">COFINS</option>
                  <option value="iss">ISS</option>
                  <option value="irpj">IRPJ</option>
                  <option value="csll">CSLL</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Tax Rate (%)</Label>
                <Input id="rate" type="number" placeholder="e.g. 18" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jurisdiction">Jurisdiction</Label>
                <Select>
                  <option value="">Select jurisdiction</option>
                  <option value="federal">Federal</option>
                  <option value="state">State</option>
                  <option value="municipal">Municipal</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxAccount">Tax Payable Account</Label>
                <Select>
                  <option value="">Select account</option>
                  <option value="2300">2300 - ICMS Payable</option>
                  <option value="2310">2310 - IPI Payable</option>
                  <option value="2320">2320 - PIS Payable</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expenseAccount">Tax Expense Account</Label>
                <Select>
                  <option value="">Select account</option>
                  <option value="5600">5600 - Tax Expense</option>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Template description" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" render={<Link href="/accounting/tax-templates" />}>
            Cancel
          </Button>
          <Button>Create Template</Button>
        </div>
      </div>
    </OverviewLayout>
  )
}
