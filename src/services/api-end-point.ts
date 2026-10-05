
export const apiUrl = {
    login: "/auth/login",
    dashboardStats: "/admin/dashboard",
    users: "/admin/users",
    logOut: "/auth/logout",
    jobListing: "/admin/listings",
    jobListingByID: "/admin/listings",
    deleteListing: (userId: string) => `/admin/listings/${userId}`,
    approvedListing: (userId: string) => `/admin/listings/${userId}/approve`,
    rejectedListing: (userId: string) => `/admin/listings/${userId}/reject`,
    suspendedListing: (userId: string) => `/admin/listings/${userId}/suspend`,
    featuredListing: (userId: string) => `/admin/listings/${userId}/feature`,
    verifyUser: (userId: string) => `/admin/users/${userId}/verify`,


    // Subscriptions
    subscriptions: {
        plans: "/admin/subscriptions/plans",
        Editplans: "/admin/subscriptions/plans",
        getIDByPlan: "/admin/subscriptions/plan",
        createPlan: "/admin/subscriptions/plans",
        allSubscriptions: "/admin/subscriptions",
    },

    payments: "/admin/payments",
    payouts: "/admin/payouts",
    payoutStatistics: "/admin/payouts/statistics",
    approvePayout: (id: string) => `/admin/payouts/${id}/approve`,
    rejectPayout: (id: string) => `/admin/payouts/${id}/reject`,

    withdrawals: "/admin/withdrawals",
    withdrawalStatistics: "/admin/withdrawals/statistics",
    withdrawalHistory: "/admin/withdrawals/history",
    withdrawalReport: "/admin/withdrawals/commission-report",
    approveWithdrawal: (id: string) => `/admin/withdrawals/${id}/approve`,
    rejectWithdrawal: (id: string) => `/admin/withdrawals/${id}/reject`,

    categories: "/admin/categories",
    categoryById: (id: string) => `/admin/categories/${id}`,

    seoManagement: "/admin/cms/seo",
    cmsPages: "/admin/cms/pages",
}