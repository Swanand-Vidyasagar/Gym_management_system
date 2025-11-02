"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Download, TrendingUp } from "lucide-react"

export default function AdminReportsTab() {
  const reports = [
    {
      title: "Revenue Summary",
      description: "Monthly and yearly revenue breakdown",
      period: "Jan 2025",
      metric: "₹5,82,000",
      trend: "+12.3%",
    },
    {
      title: "Member Growth",
      description: "New member registrations and churn rate",
      period: "Jan 2025",
      metric: "32 new members",
      trend: "+2.5%",
    },
    {
      title: "Membership Distribution",
      description: "Active members by membership type",
      period: "Jan 2025",
      metric: "856 active",
      trend: "+4.2%",
    },
    {
      title: "Staff Performance",
      description: "Top performing trainers and coaches",
      period: "Jan 2025",
      metric: "Avg 4.7★",
      trend: "+0.3%",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, index) => (
          <Card key={index} className="bg-muted/50 border-border p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <BarChart3 size={32} className="text-accent opacity-20" />
              <span className="bg-accent/20 text-accent px-2 py-1 rounded text-xs font-medium">
                <TrendingUp size={12} className="inline mr-1" />
                {report.trend}
              </span>
            </div>

            <h3 className="text-lg font-bold text-foreground mb-1">{report.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{report.description}</p>

            <div className="pt-4 border-t border-border space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Period</p>
                <p className="font-semibold text-foreground">{report.period}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Value</p>
                <p className="text-2xl font-bold text-accent">{report.metric}</p>
              </div>
            </div>

            <Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground text-sm">
              <Download size={14} className="mr-2" />
              Download Report
            </Button>
          </Card>
        ))}
      </div>

      {/* General Reports Section */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Generate Custom Report</h3>
        <div className="space-y-4">
          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Generate Member Report</Button>
          <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted bg-transparent">
            Generate Revenue Report
          </Button>
          <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted bg-transparent">
            Generate Staff Report
          </Button>
        </div>
      </Card>
    </div>
  )
}
