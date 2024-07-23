export default function Chip(props: { text: string }) {
    return (
        <div className='bg-green/10 rounded-full px-2 py-1'>
            {props.text}
        </div>
    )
}