export const Pill = ({ text, className }: { text: string, className?: string }) => {
    return (
        <div className={`px-4 w-fit py-2 bg-none border-black border rounded-[60px] text-black font-medium text-xs ${className}`}>
            {text}
        </div>
    )
}