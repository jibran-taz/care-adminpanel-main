import { useEffect, useState } from "react";
import {
    Banknote,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    Search,
    Download,
    Eye,
    User,
    Calendar,
    CreditCard,
    Mail,
    Loader2,
    AlertCircle
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import makeApiRequest from "@/services/axios";
import { apiUrl } from "@/services/api-end-point";
import { notify } from "@/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomPagination } from "@/components/custom-pagination";

interface Withdrawal {
    id: number;
    provider_id: number;
    booking_id: number;
    amount: number;
    commission: number;
    net_amount: number;
    currency: string;
    status: "pending" | "approved" | "rejected" | "completed";
    created_at: string;
    provider: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        avatar_url: string;
    };
}

interface StatisticsData {
    total_count: number;
    pending_withdrawal_count: number;
    total_platform_commission: number;
    total_paid_out: number;
}

export default function Withdrawals() {
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [stats, setStats] = useState<StatisticsData | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [bulkApproving, setBulkApproving] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [perPage, setPerPage] = useState(20);

    const fetchWithdrawals = async (page: number = 1) => {
        try {
            setLoading(true);
            const response = await makeApiRequest(`${apiUrl.withdrawals}?page=${page}&per_page=${perPage}`, {
                method: "GET",
            });
            if (response.success && response.data) {
                setWithdrawals(response.data.withdrawals || []);
                if (response.data.pagination) {
                    setCurrentPage(response.data.pagination.current_page);
                    setTotalPages(response.data.pagination.last_page);
                    setTotalRecords(response.data.pagination.total);
                }
            }
        } catch (error) {
            console.error("❌ Error fetching withdrawals:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            setStatsLoading(true);
            const response = await makeApiRequest(apiUrl.withdrawalStatistics, {
                method: "GET",
            });
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error("❌ Error fetching stats:", error);
        } finally {
            setStatsLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
        fetchStats();
    }, []);

    const handleAction = async (id: number, action: 'approve' | 'reject') => {
        if (!window.confirm(`Are you sure you want to ${action} this withdrawal?`)) return;

        try {
            const url = action === 'approve'
                ? apiUrl.approveWithdrawal(String(id))
                : apiUrl.rejectWithdrawal(String(id));

            const response = await makeApiRequest(url, { method: "POST" });
            if (response.success) {
                notify({ message: `Withdrawal ${action}d successfully`, type: "success" });
                fetchWithdrawals(currentPage);
                fetchStats();
            }
        } catch (error) {
            notify({ message: `Failed to ${action} withdrawal`, type: "error" });
        }
    }

    const handleBulkApprove = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Are you sure you want to approve ${selectedIds.length} withdrawals?`)) return;

        try {
            setBulkApproving(true);
            const response = await makeApiRequest("admin/withdrawals/bulk-approve", {
                method: "POST",
                data: { withdrawal_ids: selectedIds }
            });

            if (response.success) {
                notify({ message: `${selectedIds.length} withdrawals approved successfully`, type: "success" });
                setSelectedIds([]);
                fetchWithdrawals(currentPage);
                fetchStats();
            }
        } catch (error) {
            notify({ message: "Failed to bulk approve withdrawals", type: "error" });
        } finally {
            setBulkApproving(false);
        }
    }

    const filtered = (Array.isArray(withdrawals) ? withdrawals : []).filter(w => {
        const matchesSearch =
            `${w.provider?.first_name} ${w.provider?.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            w.provider?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            String(w.id).includes(searchQuery);

        const matchesStatus =
            statusFilter === "all" || w.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Worker Job Payouts</h1>
                    <p className="text-muted-foreground">
                        Manage per-job payment releases and commissions
                    </p>
                </div>
                {selectedIds.length > 0 && (
                    <Button
                        onClick={handleBulkApprove}
                        disabled={bulkApproving}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {bulkApproving ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                        Bulk Approve ({selectedIds.length})
                    </Button>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <StatsCard
                    title="Total Requests"
                    value={String(stats?.total_count || 0)}
                    icon={Banknote}
                    trend="up"
                    change="All time"
                />
                <StatsCard
                    title="Pending Approval"
                    value={String(stats?.pending_withdrawal_count || 0)}
                    icon={Clock}
                    trend="up"
                    change="Awaiting release"
                />
                <StatsCard
                    title="Total Commission"
                    value={`$${Number(stats?.total_platform_commission || 0).toFixed(2)}`}
                    icon={TrendingUp}
                    trend="up"
                    change="Platform earnings"
                />
                <StatsCard
                    title="Total Released"
                    value={`$${Number(stats?.total_paid_out || 0).toFixed(2)}`}
                    icon={CheckCircle}
                    trend="up"
                    change="To workers"
                />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search withdrawals..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    const pendings = filtered.filter(w => w.status === 'pending').map(w => w.id);
                                                    setSelectedIds(pendings);
                                                } else {
                                                    setSelectedIds([]);
                                                }
                                            }}
                                            checked={selectedIds.length > 0 && selectedIds.length === filtered.filter(w => w.status === 'pending').length}
                                        />
                                    </TableHead>
                                    <TableHead>ID / Booking</TableHead>
                                    <TableHead>Worker</TableHead>
                                    <TableHead>Gross Amount</TableHead>
                                    <TableHead>Commission</TableHead>
                                    <TableHead>Net to Worker</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={7} className="text-center py-10"><Loader2 className="animate-spin h-8 w-8 mx-auto" /></TableCell></TableRow>
                                ) : filtered.map(w => (
                                    <TableRow key={w.id}>
                                        <TableCell>
                                            {w.status === 'pending' && (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(w.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedIds([...selectedIds, w.id]);
                                                        } else {
                                                            setSelectedIds(selectedIds.filter(id => id !== w.id));
                                                        }
                                                    }}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-semibold text-blue-600">#{w.id}</div>
                                            <div className="text-[10px] text-muted-foreground">Booking #{w.booking_id}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={w.provider.avatar_url} />
                                                    <AvatarFallback>{w.provider.first_name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="text-sm">
                                                    <div className="font-medium">{w.provider.first_name} {w.provider.last_name}</div>
                                                    <div className="text-xs text-muted-foreground">{w.provider.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-semibold text-slate-900">${w.amount}</TableCell>
                                        <TableCell className="text-red-600">-${w.commission}</TableCell>
                                        <TableCell className="font-bold text-green-600">${w.net_amount}</TableCell>
                                        <TableCell>
                                            <Badge className={
                                                w.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    w.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                            }>
                                                {w.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            {w.status === 'pending' && (
                                                <>
                                                    <Button size="sm" variant="ghost" className="text-green-600" onClick={() => handleAction(w.id, 'approve')}>
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleAction(w.id, 'reject')}>
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                            <Button size="sm" variant="ghost" onClick={() => { setSelectedWithdrawal(w); setIsDetailOpen(true) }}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                    <CustomPagination
                        currentPage={currentPage}
                        lastPage={totalPages}
                        onPageChange={(page) => fetchWithdrawals(page)}
                        total={totalRecords}
                        from={(currentPage - 1) * perPage + 1}
                        to={Math.min(currentPage * perPage, totalRecords)}
                    />
                </div>
            )}

            {/* Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Withdrawal Details</DialogTitle>
                    </DialogHeader>
                    {selectedWithdrawal && (
                        <div className="space-y-4 pt-4">
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <span className="text-sm text-muted-foreground">Booking Reference</span>
                                <span className="font-mono font-bold">#{selectedWithdrawal.booking_id}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 border rounded-lg">
                                    <div className="text-xs text-muted-foreground">Gross Job Pay</div>
                                    <div className="text-lg font-bold">${selectedWithdrawal.amount}</div>
                                </div>
                                <div className="p-3 border rounded-lg">
                                    <div className="text-xs text-muted-foreground">Platform Fee (15%)</div>
                                    <div className="text-lg font-bold text-red-600">${selectedWithdrawal.commission}</div>
                                </div>
                            </div>
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                                <div className="text-xs text-green-700">Net Release to Worker</div>
                                <div className="text-3xl font-black text-green-700">${selectedWithdrawal.net_amount}</div>
                            </div>
                            <Separator />
                            <div>
                                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Worker Bank Info</h4>
                                <p className="text-sm italic text-muted-foreground">Standard Direct Deposit (Stripe Connect)</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
