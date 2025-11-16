interface PurchasePromptProps {
  isOpen: boolean;
  itemName: string;
  itemPrice: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const PurchasePrompt: React.FC<PurchasePromptProps> = ({ isOpen, itemName, itemPrice, onConfirm, onCancel }: PurchasePromptProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-[18px] p-5 text-[36px] text-[#5D608A] w-[30rem] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
        <p>Purchase {itemName.toUpperCase()} for {itemPrice} Notes?</p>

        <div className="flex gap-3 mt-5 text-black">
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#BAFFD1] hover:cursor-pointer rounded-[18px]"
          >
            Buy
          </button>

          <button
            onClick={onCancel}
            className="flex-1 bg-[#FFB5B5] hover:cursor-pointer rounded-[18px]"
          >
            Cancel
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default PurchasePrompt;