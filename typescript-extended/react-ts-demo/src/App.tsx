// typed react component using props

type Props = {
  name: string
}

export default function App({ name }: Props) {
  return <h1>hello {name}</h1>
}
