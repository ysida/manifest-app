import React, { useState } from 'react';
import { MetadataSDKType } from '@liftedinit/manifestjs/dist/codegen/cosmos/bank/v1beta1/bank';
import MintForm from '@/components/factory/forms/MintForm';
import { useGroupsByAdmin, usePoaGetAdmin } from '@/hooks';
import { ExtendedMetadataSDKType, truncateString } from '@/utils';
import { MultiMintModal } from './multiMfxMintModal';

export default function MintModal({
  denom,
  address,
  refetch,
  balance,
  totalSupply,
  isOpen,
  onClose,
  onSwitchToMultiMint,
  admin,
  isPoaAdminLoading,
}: {
  denom: ExtendedMetadataSDKType | null;
  address: string;
  refetch: () => void;
  balance: string;
  totalSupply: string;
  isOpen: boolean;
  onClose: () => void;
  onSwitchToMultiMint: () => void;
  admin: string;
  isPoaAdminLoading: boolean;
}) {
  const [isMultiMintOpen, setIsMultiMintOpen] = useState(false);

  const { groupByAdmin, isGroupByAdminLoading } = useGroupsByAdmin(
    admin ?? 'manifest1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfmy9qj'
  );

  const members = groupByAdmin?.groups?.[0]?.members;
  const isAdmin = members?.some(member => member?.member?.address === address);
  const isLoading = isPoaAdminLoading || isGroupByAdminLoading;

  if (!denom || !address) {
    console.warn('MintModal: Missing required props', { denom, address });
    return null;
  }

  const safeBalance = balance || '0';
  const safeTotalSupply = totalSupply || '0';

  const handleMultiMintOpen = () => {
    onSwitchToMultiMint();
  };

  const handleMultiMintClose = () => {
    setIsMultiMintOpen(false);
  };

  return (
    <>
      <dialog id={`mint-modal-${denom?.base}`} className={`modal ${isOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-4xl mx-auto rounded-[24px] bg-[#F4F4FF] dark:bg-[#1D192D] shadow-lg">
          <form method="dialog" onSubmit={onClose}>
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-[#00000099] dark:text-[#FFFFFF99] hover:bg-[#0000000A] dark:hover:bg-[#FFFFFF1A]">
              ✕
            </button>
          </form>
          <h3 className="text-xl font-semibold text-[#161616] dark:text-white mb-6">
            Mint{' '}
            <span className="font-light text-primary">
              {truncateString(denom.display ?? 'Denom', 20).toUpperCase()}
            </span>
          </h3>
          <div className="py-4">
            {isLoading ? (
              <div className="skeleton h-[17rem] max-h-72 w-full"></div>
            ) : (
              <MintForm
                isAdmin={isAdmin ?? false}
                admin={admin}
                balance={safeBalance}
                totalSupply={safeTotalSupply}
                refetch={refetch}
                address={address}
                denom={denom}
                onMultiMintClick={handleMultiMintOpen}
              />
            )}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop" onSubmit={onClose}>
          <button>close</button>
        </form>
      </dialog>

      <MultiMintModal
        isOpen={isMultiMintOpen}
        onClose={handleMultiMintClose}
        admin={admin ?? ''}
        address={address}
        denom={denom}
        exponent={denom?.denom_units?.[1]?.exponent || 0}
        refetch={refetch}
      />
    </>
  );
}
