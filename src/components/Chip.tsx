export default function Chip(props: { text: string }) {
    return (
        <div className='bg-tan rounded-full px-2 py-1'>
            {props.text}
        </div>
    )
}