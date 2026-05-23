import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "Cleanify | Admin Portal",
    description: "Cleanify Admin Portal - Manage bookings and services",
    robots: {
        index: false,
        follow: false,
        googleBot: {
            index: false,
            follow: false,
        },
    },
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
