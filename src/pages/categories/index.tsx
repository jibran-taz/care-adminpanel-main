import { useEffect, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    FolderTree,
    CheckCircle,
    XCircle,
    MoreVertical,
    Loader2
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import makeApiRequest from "@/services/axios";
import { apiUrl } from "@/services/api-end-point";
import { notify } from "@/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    is_active: boolean;
    created_at: string;
}

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        is_active: true
    });

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const response = await makeApiRequest(apiUrl.categories, {
                method: "GET",
            });
            if (response.success) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error("❌ Error fetching categories:", error);
            notify({ message: "Failed to fetch categories", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = (category: Category | null = null) => {
        if (category) {
            setSelectedCategory(category);
            setFormData({
                name: category.name,
                description: category.description || "",
                is_active: category.is_active
            });
        } else {
            setSelectedCategory(null);
            setFormData({
                name: "",
                description: "",
                is_active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSaveCategory = async () => {
        if (!formData.name) {
            notify({ message: "Name is required", type: "error" });
            return;
        }

        try {
            setIsSaving(true);
            const url = selectedCategory
                ? apiUrl.categoryById(String(selectedCategory.id))
                : apiUrl.categories;
            const method = selectedCategory ? "PUT" : "POST";

            const response = await makeApiRequest(url, {
                method,
                data: formData
            });

            if (response.success) {
                notify({
                    message: `Category ${selectedCategory ? "updated" : "created"} successfully`,
                    type: "success"
                });
                setIsModalOpen(false);
                fetchCategories();
            }
        } catch (error) {
            console.error("❌ Error saving category:", error);
            notify({ message: "Failed to save category", type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            setIsDeleting(true);
            const response = await makeApiRequest(apiUrl.categoryById(String(id)), {
                method: "DELETE",
            });

            if (response.success) {
                notify({ message: "Category deleted successfully", type: "success" });
                fetchCategories();
            }
        } catch (error) {
            console.error("❌ Error deleting category:", error);
            notify({ message: "Failed to delete category", type: "error" });
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground">
                        Manage job categories and services
                    </p>
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-gradient-to-r from-green-500 to-emerald-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Icon</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell colSpan={6}><Skeleton className="h-10 w-full" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredCategories.length > 0 ? (
                                    filteredCategories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell>
                                                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                                    <FolderTree className="h-5 w-5 text-slate-500" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{category.name}</TableCell>
                                            <TableCell className="font-mono text-xs">{category.slug}</TableCell>
                                            <TableCell>
                                                <Badge variant={category.is_active ? "default" : "secondary"} className={category.is_active ? "bg-green-100 text-green-800" : ""}>
                                                    {category.is_active ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(category.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleOpenModal(category)}>
                                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => handleDeleteCategory(category.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                            No categories found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Modal for Create/Edit */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                        <DialogDescription>
                            Enter the details for the job category.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Nursing"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Input
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Short description..."
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium">Is Active</label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleSaveCategory}
                            disabled={isSaving}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {selectedCategory ? "Update Category" : "Create Category"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
