import {
    Card,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    Skeleton,
} from '@solvprotocol/ui-v2';
import dynamic from 'next/dynamic';

interface TabItem {
    value: string;
    label: string;
    content: React.ReactNode;
}


const DepositAndWithdrawSkeleton = () => {
    return (
        <div className='flex w-full flex-col gap-4 md:gap-6'>
            <div className='grid w-full grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-6'>
                {/* Left input area */}
                <div className='flex w-full flex-col gap-2'>
                    <Skeleton className='h-10' />
                </div>

                {/* Right input area */}
                <div className='flex w-full flex-col gap-2'>
                    <Skeleton className='h-10' />
                </div>
            </div>

            {/* Submit button */}
            <div className='flex w-full items-center justify-center'>
                <Skeleton className='h-10 w-full rounded-full md:w-[28rem]' />
            </div>
        </div>
    );
};

const DetailsSkeleton = () => {
    return (
        <div>
            <div className='mb-4 font-MatterSQ-Medium text-xl text-textColor'>
                Contract Info
            </div>

            <div className='mb-6 flex space-x-[2rem] md:space-x-[3.875rem]'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-4 w-20' />
            </div>

            <div className='mb-4 font-MatterSQ-Medium text-textColor'>
                Description
            </div>

            <Skeleton className='h-[50px] w-full' />
        </div>
    );
};

// Dynamic imports for better performance
const Deposit = dynamic(() => import('@/components/Deposit'), {
    ssr: false,
    loading: () => <DepositAndWithdrawSkeleton />,
});
const Withdraw = dynamic(() => import('@/components/Withdraw'), {
    ssr: false,
    loading: () => <DepositAndWithdrawSkeleton />,
});
const Details = dynamic(() => import('@/components/Details'), {
    ssr: false,
    loading: () => <DetailsSkeleton />,
});

export default function ActionTab() {
    const tabs: TabItem[] = [
        {
            value: 'deposit',
            label: 'Deposit',
            content: <Deposit />,
        },
        {
            value: 'withdraw',
            label: 'Withdraw',
            content: <Withdraw />,
        },
        {
            value: 'details',
            label: 'Details',
            content: <Details />,
        },
    ];
    return (
        <Card
            className='relative mb-4 box-border !p-4 md:mb-8 md:!p-8'
            id='transaction'
        >
            <Tabs defaultValue='deposit' className='w-full'>
                <TabsList className='mb-2 h-[2.75rem] w-[17.6875rem] !space-x-1 !bg-transparent !p-0 md:mb-[2.25rem]'>
                    {tabs.map(({ value, label }) => (
                        <TabsTrigger
                            key={value}
                            value={value}
                            className='rounded-full text-[1rem]'
                        >
                            {label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {tabs.map(({ value, content }) => (
                    <TabsContent key={value} value={value}>
                        {content}
                    </TabsContent>
                ))}
            </Tabs>
        </Card>
    );
}
