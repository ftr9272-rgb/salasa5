import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function TestCard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Card Component</h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Test Card</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Test Content</div>
          <p className="text-xs text-muted-foreground">This is a test card</p>
        </CardContent>
      </Card>
    </div>
  );
}