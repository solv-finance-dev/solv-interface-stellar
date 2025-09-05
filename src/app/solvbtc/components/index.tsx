import {
  Card,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@solvprotocol/ui-v2';
import Deposit from './Deposit';
import Withdraw from './withdraw';
import Details from './Details';

interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

export default function SolvBtc() {
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
        <TabsList className='mb-[2.25rem] h-[2.75rem] w-[17.6875rem] !space-x-1 !bg-transparent !p-0'>
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
