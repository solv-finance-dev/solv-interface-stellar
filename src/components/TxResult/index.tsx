import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export type TxResultType = 'success' | 'error' | 'warning';

interface TxResultProps {
  type: TxResultType;
  title: string;
  message: string;
  txHash?: string;
  className?: string;
}

const TxResult: React.FC<TxResultProps> = ({
  type,
  title,
  message,
  txHash,
  className = '',
}) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          titleColor: 'text-green-600',
          iconColor: 'text-green-500',
        };
      case 'error':
        return {
          icon: XCircle,
          titleColor: 'text-red-600',
          iconColor: 'text-red-500',
        };
      case 'warning':
        return {
          icon: AlertCircle,
          titleColor: 'text-yellow-600',
          iconColor: 'text-yellow-500',
        };
      default:
        return {
          icon: AlertCircle,
          titleColor: 'text-gray-600',
          iconColor: 'text-gray-500',
        };
    }
  };

  const { icon: Icon, titleColor, iconColor } = getTypeConfig();

  return (
    <div className={`flex items-start space-x-3 ${className}`}>
      <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${iconColor}`} />
      <div className='min-w-0 flex-1'>
        <div className={`mb-1 font-bold ${titleColor}`}>{title}</div>
        <div className='text-sm text-gray-700'>{message}</div>
        {txHash && (
          <div className='mt-2'>
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-xs font-medium text-blue-500 underline hover:text-blue-700'
            >
              View Transaction
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TxResult;
