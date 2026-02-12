import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Play, Code2, Download, Copy, Check } from 'lucide-react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const LANGUAGES = [
  { id: 'python', name: 'Python', template: 'print("Hello from Python!")\n\n# Write your code here\n' },
  { id: 'javascript', name: 'JavaScript', template: 'console.log("Hello from JavaScript!");\n\n// Write your code here\n' },
  { id: 'cpp', name: 'C++', template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello from C++!" << endl;\n    return 0;\n}' },
  { id: 'java', name: 'Java', template: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}' },
]

export default function IDE() {
  const [language, setLanguage] = useState(LANGUAGES[0])
  const [code, setCode] = useState(language.template)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleLanguageChange = (langId: string) => {
    const lang = LANGUAGES.find(l => l.id === langId)
    if (lang) {
      setLanguage(lang)
      setCode(lang.template)
    }
  }

  const handleRun = async () => {
    setIsRunning(true)
    setOutput('Running...')

    try {
      const response = await axios.post(`${API_BASE_URL}/execute`, {
        language: language.id,
        code: code,
        input: ''
      })

      const result = response.data

      if (result.success) {
        setOutput(result.output || 'Program executed successfully with no output.')
      } else {
        setOutput(`Error:\n${result.error || 'Unknown error occurred'}`)
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to execute code'
      setOutput(`Execution failed:\n${errorMsg}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const extensions: Record<string, string> = {
      cpp: 'cpp',
      python: 'py',
      java: 'java',
      javascript: 'js',
    }
    const ext = extensions[language.id] || 'txt'
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `solution.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Code2 className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Code Editor</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Language selector */}
            <select
              value={language.id}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>

            {/* Action buttons */}
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
          </div>
        </div>
      </div>

      {/* Editor and Output */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 border-r border-gray-200">
          <Editor
            height="100%"
            language={language.id}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Output Panel */}
        <div className="w-96 bg-white flex flex-col">
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900">Output</h3>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {output ? (
              <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">{output}</pre>
            ) : (
              <p className="text-sm text-gray-500">Run your code to see the output here...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
