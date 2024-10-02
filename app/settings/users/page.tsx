import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function UserManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">User Management</h3>
        <p className="text-sm text-muted-foreground">
          Manage user accounts and permissions.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new-user">Add New User</Label>
          <div className="flex space-x-2">
            <Input id="new-user" placeholder="Enter email address" />
            <Button>Add User</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>john@example.com</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>
                <Button variant="ghost">Edit</Button>
                <Button variant="ghost" className="text-red-500">Delete</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>jane@example.com</TableCell>
              <TableCell>User</TableCell>
              <TableCell>
                <Button variant="ghost">Edit</Button>
                <Button variant="ghost" className="text-red-500">Delete</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}