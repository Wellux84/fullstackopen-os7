import  { useField } from './useField'
import useResource from './useResource'

const App = () => {
  const { reset: resetContent, ...content } = useField('text')
  const { reset: resetName, ...name } = useField('text')
  const { reset: resetNumber, ...number } = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.inputProps.value })
    resetContent()
  }

  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.inputProps.value, number: number.inputProps.value })
    resetName()
    resetNumber()
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content.inputProps} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name.inputProps} /> <br />
        number <input {...number.inputProps} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App
