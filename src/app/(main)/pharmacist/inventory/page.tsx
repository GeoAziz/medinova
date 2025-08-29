import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getPharmacistInventoryData } from '@/lib/actions/pharmacist-dashboard.actions';

export default async function PharmacistInventoryPage({ searchParams }: { searchParams?: { query?: string } }) {
  const query = searchParams?.query || '';
  const inventory = await getPharmacistInventoryData(query);

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Inventory Management"
        description="View and manage medication stock levels."
        actions={<Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Drug</Button>}
      />
      <GlowingCard>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Medication Stock</CardTitle>
              <CardDescription>
                {inventory.length} different medications found for the current query.
              </CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <form>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name or NDC..." className="pl-9" name="query" defaultValue={query} />
              </form>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>NDC</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Restock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.length > 0 ? inventory.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.medicationName}</TableCell>
                    <TableCell>{item.ndc}</TableCell>
                    <TableCell>{item.quantity.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === 'In Stock' ? 'default' : 
                          item.status === 'Low Stock' ? 'secondary' : 'destructive'
                        }
                        className={item.status === 'In Stock' ? 'bg-green-600/80' : ''}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.lastRestock}</TableCell>
                    <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                            <Button size="icon" variant="outline"><Edit className="h-4 w-4" /></Button>
                            <Button size="icon" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </TableCell>
                  </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            No inventory items found.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </GlowingCard>
    </div>
  );
}
