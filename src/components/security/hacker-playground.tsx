'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Terminal, Play, Pause, RotateCcw, Shield, Skull,
  Wifi, Server, Database, Lock, Unlock, Eye, Code,
  Zap, AlertTriangle, CheckCircle, XCircle, Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// MATRIX RAIN EFFECT
// ============================================

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const charArray = chars.split('')
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1)

    let animationId: number

    const draw = () => {
      if (!isRunning) return

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#0f0'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)]
        ctx.fillStyle = `rgba(0, ${150 + Math.random() * 105}, 0, ${0.5 + Math.random() * 0.5})`
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      animationId = requestAnimationFrame(draw)
    }

    if (isRunning) {
      draw()
    }

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [isRunning])

  return (
    <div className="relative rounded-xl overflow-hidden border border-green-500/30 bg-black">
      <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-xs text-green-500 font-mono">matrix.exe</span>
      </div>
      <button
        onClick={() => setIsRunning(!isRunning)}
        className="absolute top-2 right-2 z-10 p-1.5 bg-green-500/20 hover:bg-green-500/30 rounded text-green-500 transition-colors"
      >
        {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>
      <canvas
        ref={canvasRef}
        className="w-full h-64"
        style={{ display: 'block' }}
      />
      <div className="absolute bottom-2 left-2 text-xs text-green-500/70 font-mono">
        [ MATRIX SIMULATION ACTIVE ]
      </div>
    </div>
  )
}

// ============================================
// HACKER TERMINAL
// ============================================

const HACKER_COMMANDS = [
  { cmd: 'nmap -sS -sV -O target.com', output: ['Starting Nmap 7.94...', 'Scanning target.com (192.168.1.100)...', 'PORT     STATE SERVICE VERSION', '22/tcp   open  ssh     OpenSSH 8.9', '80/tcp   open  http    nginx 1.18.0', '443/tcp  open  https   nginx 1.18.0', '3306/tcp open  mysql   MySQL 8.0.32', 'OS: Linux 5.15.0-generic', 'Nmap done: 1 IP address (1 host up)'] },
  { cmd: 'sqlmap -u "http://target.com/page?id=1" --dbs', output: ['[*] starting @ 14:32:05', '[14:32:05] [INFO] testing connection to target URL', '[14:32:06] [INFO] testing if target is protected by WAF/IPS', '[14:32:08] [INFO] target URL appears to be UNION injectable', '[14:32:10] [INFO] fetching database names', 'available databases [3]:', '[*] information_schema', '[*] mysql', '[*] webapp_production', '[14:32:12] [INFO] fetched data logged'] },
  { cmd: 'hydra -l admin -P wordlist.txt ssh://target.com', output: ['Hydra v9.5 starting...', '[DATA] max 16 tasks per 1 server', '[DATA] attacking ssh://target.com:22/', '[22][ssh] host: target.com login: admin password: ********', '1 of 1 target successfully completed', 'Hydra finished'] },
  { cmd: 'msfconsole -q -x "use exploit/multi/handler"', output: ['[*] Starting Metasploit Framework...', 'msf6 > use exploit/multi/handler', '[*] Using configured payload generic/shell_reverse_tcp', 'msf6 exploit(multi/handler) > set LHOST 10.0.0.1', 'LHOST => 10.0.0.1', 'msf6 exploit(multi/handler) > set LPORT 4444', 'LPORT => 4444', 'msf6 exploit(multi/handler) > exploit', '[*] Started reverse TCP handler on 10.0.0.1:4444', '[*] Command shell session 1 opened'] },
  { cmd: 'nikto -h http://target.com', output: ['- Nikto v2.5.0', '+ Target IP: 192.168.1.100', '+ Target Hostname: target.com', '+ Target Port: 80', '+ Start Time: 2024-01-15 14:35:00', '+ Server: nginx/1.18.0', '+ /admin/: Admin directory found', '+ /backup/: Backup directory found', '+ /phpinfo.php: PHP info file found', '+ OSVDB-3092: Possible sensitive files', '+ 7 item(s) reported on remote host'] },
  { cmd: 'gobuster dir -u http://target.com -w common.txt', output: ['===============================================================', 'Gobuster v3.6', '===============================================================', '[+] Url:            http://target.com', '[+] Wordlist:       common.txt', '===============================================================', '/admin (Status: 301)', '/api (Status: 200)', '/backup (Status: 403)', '/config (Status: 403)', '/uploads (Status: 301)', '/wp-admin (Status: 301)', '==============================================================='] },
  { cmd: 'hashcat -m 0 -a 0 hash.txt rockyou.txt', output: ['hashcat v6.2.6 starting...', 'OpenCL Platform #1: NVIDIA CUDA', '* Device #1: NVIDIA GeForce RTX 4090', 'Minimum password length: 0', 'Maximum password length: 256', 'Dictionary cache: 14344384 words', '5d41402abc4b2a76b9719d911017c592:hello', 'e10adc3949ba59abbe56e057f20f883e:123456', 'Session..........: hashcat', 'Status...........: Cracked', 'Hash.Mode........: 0 (MD5)', 'Speed.#1.........: 45.2 GH/s'] },
  { cmd: 'aircrack-ng -w wordlist.txt capture.cap', output: ['Aircrack-ng 1.7', '[00:00:15] 28562/139583 keys tested (1903.47 k/s)', 'Time left: 58 seconds', '', '                     KEY FOUND! [ hacktheplanet ]', '', 'Master Key     : A1 B2 C3 D4 E5 F6 G7 H8', 'Transient Key  : 00 11 22 33 44 55 66 77', 'EAPOL HMAC     : AA BB CC DD EE FF 00 11'] },
]

export function HackerTerminal() {
  const [lines, setLines] = useState<{ type: 'cmd' | 'output' | 'prompt'; text: string }[]>([
    { type: 'output', text: '╔══════════════════════════════════════════════════════════╗' },
    { type: 'output', text: '║  ETHICAL HACKER TERMINAL v3.1.4 - AUTHORIZED ACCESS ONLY  ║' },
    { type: 'output', text: '╚══════════════════════════════════════════════════════════╝' },
    { type: 'output', text: '' },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [isAutoMode, setIsAutoMode] = useState(true)
  const terminalRef = useRef<HTMLDivElement>(null)
  const commandIndexRef = useRef(0)

  const typeCommand = useCallback(async (command: typeof HACKER_COMMANDS[0]) => {
    setIsTyping(true)

    // Type command character by character
    let currentCmd = ''
    for (const char of command.cmd) {
      currentCmd += char
      setLines(prev => {
        const newLines = [...prev]
        const lastLine = newLines[newLines.length - 1]
        if (lastLine?.type === 'cmd') {
          newLines[newLines.length - 1] = { type: 'cmd', text: currentCmd }
        } else {
          newLines.push({ type: 'cmd', text: currentCmd })
        }
        return newLines
      })
      await new Promise(r => setTimeout(r, 30 + Math.random() * 50))
    }

    await new Promise(r => setTimeout(r, 300))

    // Output lines one by one
    for (const line of command.output) {
      setLines(prev => [...prev, { type: 'output', text: line }])
      await new Promise(r => setTimeout(r, 100 + Math.random() * 150))
    }

    setLines(prev => [...prev, { type: 'output', text: '' }])
    setIsTyping(false)
  }, [])

  useEffect(() => {
    if (!isAutoMode || isTyping) return

    const runNextCommand = async () => {
      const command = HACKER_COMMANDS[commandIndexRef.current]
      await typeCommand(command)
      commandIndexRef.current = (commandIndexRef.current + 1) % HACKER_COMMANDS.length
    }

    const timeout = setTimeout(runNextCommand, 1500)
    return () => clearTimeout(timeout)
  }, [isAutoMode, isTyping, typeCommand])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  const handleReset = () => {
    setLines([
      { type: 'output', text: '╔══════════════════════════════════════════════════════════╗' },
      { type: 'output', text: '║  ETHICAL HACKER TERMINAL v3.1.4 - AUTHORIZED ACCESS ONLY  ║' },
      { type: 'output', text: '╚══════════════════════════════════════════════════════════╝' },
      { type: 'output', text: '' },
    ])
    commandIndexRef.current = 0
  }

  return (
    <div className="rounded-xl overflow-hidden border border-green-500/30 bg-black">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-green-500/30">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <Terminal className="w-4 h-4 text-green-500 ml-2" />
          <span className="text-xs text-green-500 font-mono">root@kali:~#</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAutoMode(!isAutoMode)}
            className={cn(
              'p-1.5 rounded text-xs font-mono transition-colors',
              isAutoMode ? 'bg-green-500/20 text-green-500' : 'bg-zinc-800 text-zinc-500'
            )}
          >
            {isAutoMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="h-80 overflow-y-auto p-4 font-mono text-sm scrollbar-thin scrollbar-thumb-green-500/30 scrollbar-track-transparent"
      >
        {lines.map((line, idx) => (
          <div key={idx} className="leading-relaxed">
            {line.type === 'cmd' ? (
              <span>
                <span className="text-green-500">root@kali</span>
                <span className="text-zinc-500">:</span>
                <span className="text-blue-400">~</span>
                <span className="text-zinc-500"># </span>
                <span className="text-white">{line.text}</span>
                {idx === lines.length - 1 && isTyping && (
                  <span className="animate-pulse text-green-500">▋</span>
                )}
              </span>
            ) : (
              <span className="text-green-400/80">{line.text}</span>
            )}
          </div>
        ))}
        {!isTyping && (
          <div>
            <span className="text-green-500">root@kali</span>
            <span className="text-zinc-500">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-zinc-500"># </span>
            <span className="animate-pulse text-green-500">▋</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// NETWORK ATTACK VISUALIZER
// ============================================

interface NetworkNode {
  id: string
  label: string
  type: 'attacker' | 'target' | 'server' | 'firewall' | 'database'
  x: number
  y: number
  status: 'idle' | 'scanning' | 'breached' | 'protected'
}

const NETWORK_NODES: NetworkNode[] = [
  { id: 'attacker', label: 'Attacker', type: 'attacker', x: 10, y: 50, status: 'idle' },
  { id: 'firewall', label: 'Firewall', type: 'firewall', x: 30, y: 50, status: 'protected' },
  { id: 'web', label: 'Web Server', type: 'server', x: 50, y: 30, status: 'idle' },
  { id: 'app', label: 'App Server', type: 'server', x: 50, y: 70, status: 'idle' },
  { id: 'db', label: 'Database', type: 'database', x: 75, y: 50, status: 'idle' },
  { id: 'target', label: 'Target', type: 'target', x: 90, y: 50, status: 'idle' },
]

export function NetworkAttackVisualizer() {
  const [nodes, setNodes] = useState(NETWORK_NODES)
  const [packets, setPackets] = useState<{ id: number; from: string; to: string; progress: number; type: 'scan' | 'attack' | 'data' }[]>([])
  const [isRunning, setIsRunning] = useState(true)
  const [attackPhase, setAttackPhase] = useState(0)
  const packetIdRef = useRef(0)

  const attackSequence = [
    { from: 'attacker', to: 'firewall', type: 'scan' as const, nodeUpdate: 'firewall', status: 'scanning' as const },
    { from: 'attacker', to: 'firewall', type: 'attack' as const, nodeUpdate: 'firewall', status: 'breached' as const },
    { from: 'attacker', to: 'web', type: 'scan' as const, nodeUpdate: 'web', status: 'scanning' as const },
    { from: 'attacker', to: 'web', type: 'attack' as const, nodeUpdate: 'web', status: 'breached' as const },
    { from: 'web', to: 'app', type: 'scan' as const, nodeUpdate: 'app', status: 'scanning' as const },
    { from: 'web', to: 'app', type: 'attack' as const, nodeUpdate: 'app', status: 'breached' as const },
    { from: 'app', to: 'db', type: 'scan' as const, nodeUpdate: 'db', status: 'scanning' as const },
    { from: 'app', to: 'db', type: 'attack' as const, nodeUpdate: 'db', status: 'breached' as const },
    { from: 'db', to: 'target', type: 'data' as const, nodeUpdate: 'target', status: 'breached' as const },
  ]

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      const attack = attackSequence[attackPhase]

      // Add packet
      setPackets(prev => [...prev, {
        id: packetIdRef.current++,
        from: attack.from,
        to: attack.to,
        progress: 0,
        type: attack.type,
      }])

      // Update node status
      setNodes(prev => prev.map(n =>
        n.id === attack.nodeUpdate ? { ...n, status: attack.status } : n
      ))

      setAttackPhase(prev => (prev + 1) % attackSequence.length)

      // Reset on full cycle
      if (attackPhase === attackSequence.length - 1) {
        setTimeout(() => {
          setNodes(NETWORK_NODES)
          setPackets([])
        }, 2000)
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [isRunning, attackPhase])

  // Animate packets
  useEffect(() => {
    const interval = setInterval(() => {
      setPackets(prev => prev
        .map(p => ({ ...p, progress: p.progress + 5 }))
        .filter(p => p.progress <= 100)
      )
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const getNodeIcon = (type: NetworkNode['type']) => {
    switch (type) {
      case 'attacker': return <Skull className="w-5 h-5" />
      case 'firewall': return <Shield className="w-5 h-5" />
      case 'server': return <Server className="w-5 h-5" />
      case 'database': return <Database className="w-5 h-5" />
      case 'target': return <Lock className="w-5 h-5" />
    }
  }

  const getNodeColor = (status: NetworkNode['status']) => {
    switch (status) {
      case 'idle': return 'border-zinc-500 text-zinc-400'
      case 'scanning': return 'border-yellow-500 text-yellow-500 animate-pulse'
      case 'breached': return 'border-red-500 text-red-500'
      case 'protected': return 'border-green-500 text-green-500'
    }
  }

  return (
    <div className="rounded-xl overflow-hidden border border-green-500/30 bg-black p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wifi className="w-5 h-5 text-green-500" />
          <span className="text-sm font-mono text-green-500">Network Attack Simulation</span>
        </div>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={cn(
            'p-1.5 rounded transition-colors',
            isRunning ? 'bg-green-500/20 text-green-500' : 'bg-zinc-800 text-zinc-500'
          )}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>

      <div className="relative h-48 bg-zinc-900/50 rounded-lg">
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full">
          {[
            ['attacker', 'firewall'],
            ['firewall', 'web'],
            ['firewall', 'app'],
            ['web', 'db'],
            ['app', 'db'],
            ['db', 'target'],
          ].map(([from, to]) => {
            const fromNode = nodes.find(n => n.id === from)
            const toNode = nodes.find(n => n.id === to)
            if (!fromNode || !toNode) return null
            return (
              <line
                key={`${from}-${to}`}
                x1={`${fromNode.x}%`}
                y1={`${fromNode.y}%`}
                x2={`${toNode.x}%`}
                y2={`${toNode.y}%`}
                stroke="#333"
                strokeWidth="2"
                strokeDasharray="4"
              />
            )
          })}

          {/* Animated Packets */}
          {packets.map(packet => {
            const fromNode = nodes.find(n => n.id === packet.from)
            const toNode = nodes.find(n => n.id === packet.to)
            if (!fromNode || !toNode) return null
            const x = fromNode.x + (toNode.x - fromNode.x) * (packet.progress / 100)
            const y = fromNode.y + (toNode.y - fromNode.y) * (packet.progress / 100)
            return (
              <circle
                key={packet.id}
                cx={`${x}%`}
                cy={`${y}%`}
                r="4"
                fill={packet.type === 'scan' ? '#eab308' : packet.type === 'attack' ? '#ef4444' : '#22c55e'}
                className="animate-pulse"
              />
            )
          })}
        </svg>

        {/* Nodes */}
        {nodes.map(node => (
          <div
            key={node.id}
            className={cn(
              'absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center',
            )}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div className={cn(
              'w-10 h-10 rounded-lg border-2 flex items-center justify-center bg-black transition-colors',
              getNodeColor(node.status)
            )}>
              {getNodeIcon(node.type)}
            </div>
            <span className="text-xs text-zinc-500 mt-1 font-mono">{node.label}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4 text-xs font-mono">
        <span className="flex items-center gap-1 text-yellow-500">
          <span className="w-2 h-2 rounded-full bg-yellow-500" /> Scanning
        </span>
        <span className="flex items-center gap-1 text-red-500">
          <span className="w-2 h-2 rounded-full bg-red-500" /> Attack
        </span>
        <span className="flex items-center gap-1 text-green-500">
          <span className="w-2 h-2 rounded-full bg-green-500" /> Data Exfil
        </span>
      </div>
    </div>
  )
}

// ============================================
// SYSTEM BREACH ANIMATION
// ============================================

const BREACH_STEPS = [
  { phase: 'Reconnaissance', icon: Eye, status: 'Gathering target information...', duration: 2000 },
  { phase: 'Scanning', icon: Activity, status: 'Scanning ports and services...', duration: 2500 },
  { phase: 'Enumeration', icon: Database, status: 'Enumerating vulnerabilities...', duration: 2000 },
  { phase: 'Exploitation', icon: Zap, status: 'Exploiting CVE-2024-XXXX...', duration: 3000 },
  { phase: 'Privilege Escalation', icon: Unlock, status: 'Escalating to root...', duration: 2500 },
  { phase: 'Data Extraction', icon: Server, status: 'Extracting sensitive data...', duration: 3000 },
  { phase: 'Covering Tracks', icon: Shield, status: 'Clearing logs and traces...', duration: 2000 },
  { phase: 'Mission Complete', icon: CheckCircle, status: 'ACCESS GRANTED', duration: 0 },
]

export function SystemBreachAnimation() {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    if (!isRunning) return

    const step = BREACH_STEPS[currentStep]
    if (!step) return

    // Add log entry
    setLogs(prev => [...prev.slice(-8), `[${new Date().toLocaleTimeString()}] ${step.phase}: ${step.status}`])

    if (step.duration === 0) {
      // Final step - reset after delay
      const timeout = setTimeout(() => {
        setCurrentStep(0)
        setProgress(0)
        setLogs([])
      }, 3000)
      return () => clearTimeout(timeout)
    }

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + (100 / (step.duration / 50))
      })
    }, 50)

    // Move to next step
    const stepTimeout = setTimeout(() => {
      setCurrentStep(prev => prev + 1)
      setProgress(0)
    }, step.duration)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(stepTimeout)
    }
  }, [currentStep, isRunning])

  const handleReset = () => {
    setCurrentStep(0)
    setProgress(0)
    setLogs([])
  }

  const step = BREACH_STEPS[currentStep]
  const Icon = step?.icon || AlertTriangle

  return (
    <div className="rounded-xl overflow-hidden border border-green-500/30 bg-black p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Skull className="w-5 h-5 text-red-500" />
          <span className="text-sm font-mono text-green-500">System Breach Simulator</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={cn(
              'p-1.5 rounded transition-colors',
              isRunning ? 'bg-green-500/20 text-green-500' : 'bg-zinc-800 text-zinc-500'
            )}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Current Phase Display */}
      <div className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-lg mb-4">
        <div className={cn(
          'w-16 h-16 rounded-xl flex items-center justify-center',
          currentStep === BREACH_STEPS.length - 1 ? 'bg-green-500/20' : 'bg-red-500/20'
        )}>
          <Icon className={cn(
            'w-8 h-8',
            currentStep === BREACH_STEPS.length - 1 ? 'text-green-500' : 'text-red-500'
          )} />
        </div>
        <div className="flex-1">
          <h3 className={cn(
            'text-lg font-bold font-mono',
            currentStep === BREACH_STEPS.length - 1 ? 'text-green-500' : 'text-red-500'
          )}>
            {step?.phase}
          </h3>
          <p className="text-sm text-zinc-400 font-mono">{step?.status}</p>
          {step?.duration > 0 && (
            <div className="mt-2 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-yellow-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-4">
        {BREACH_STEPS.map((s, idx) => {
          const StepIcon = s.icon
          return (
            <div
              key={idx}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                idx < currentStep ? 'bg-red-500 text-white' :
                idx === currentStep ? 'bg-yellow-500/20 text-yellow-500 animate-pulse' :
                'bg-zinc-800 text-zinc-600'
              )}
            >
              {idx < currentStep ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <StepIcon className="w-4 h-4" />
              )}
            </div>
          )
        })}
      </div>

      {/* Log Output */}
      <div className="h-32 bg-zinc-900/50 rounded-lg p-3 overflow-y-auto font-mono text-xs">
        {logs.map((log, idx) => (
          <div key={idx} className="text-green-400/80 leading-relaxed">
            {log}
          </div>
        ))}
        {isRunning && (
          <span className="animate-pulse text-green-500">_</span>
        )}
      </div>
    </div>
  )
}

// ============================================
// CODE RAIN (Vertical Scrolling Code)
// ============================================

const CODE_SNIPPETS = [
  'def exploit(target):',
  '    payload = generate_shellcode()',
  '    sock = socket.socket()',
  '    sock.connect((target, 4444))',
  '    sock.send(payload)',
  '    return sock.recv(1024)',
  '',
  'async function bruteforce(url) {',
  '  const passwords = await loadWordlist();',
  '  for (const pwd of passwords) {',
  '    const res = await fetch(url, {',
  '      method: "POST",',
  '      body: JSON.stringify({ password: pwd })',
  '    });',
  '    if (res.ok) return pwd;',
  '  }',
  '}',
  '',
  'SELECT * FROM users WHERE',
  '  username = "admin" OR 1=1--"',
  '  AND password = "anything"',
  '',
  'nmap -sS -sV -O -A target.com',
  'sqlmap -u "url?id=1" --dbs --dump',
  'hydra -l admin -P list ssh://host',
  '',
  'msfvenom -p windows/meterpreter/',
  '  reverse_tcp LHOST=10.0.0.1',
  '  LPORT=4444 -f exe > shell.exe',
  '',
  'hashcat -m 1000 hash.txt rockyou',
  'john --wordlist=pass.txt hash.txt',
  '',
  'class Exploit:',
  '    def __init__(self, target):',
  '        self.target = target',
  '        self.session = None',
  '    ',
  '    def execute(self):',
  '        vuln = self.scan()',
  '        if vuln:',
  '            self.exploit(vuln)',
  '            return self.get_shell()',
]

export function CodeRain() {
  const [lines, setLines] = useState<{ text: string; opacity: number }[]>([])
  const [isRunning, setIsRunning] = useState(true)
  const indexRef = useRef(0)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      const newLine = CODE_SNIPPETS[indexRef.current % CODE_SNIPPETS.length]
      indexRef.current++

      setLines(prev => {
        const updated = prev.map(l => ({ ...l, opacity: l.opacity - 0.05 })).filter(l => l.opacity > 0)
        return [...updated, { text: newLine, opacity: 1 }].slice(-20)
      })
    }, 200)

    return () => clearInterval(interval)
  }, [isRunning])

  return (
    <div className="rounded-xl overflow-hidden border border-green-500/30 bg-black relative">
      <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
        <Code className="w-4 h-4 text-green-500" />
        <span className="text-xs text-green-500 font-mono">live_feed.sh</span>
      </div>
      <button
        onClick={() => setIsRunning(!isRunning)}
        className="absolute top-2 right-2 z-10 p-1.5 bg-green-500/20 hover:bg-green-500/30 rounded text-green-500 transition-colors"
      >
        {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>
      <div className="h-64 overflow-hidden p-4 pt-10 font-mono text-sm">
        <AnimatePresence>
          {lines.map((line, idx) => (
            <motion.div
              key={`${idx}-${line.text}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: line.opacity, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-green-500 whitespace-pre leading-relaxed"
              style={{ opacity: line.opacity }}
            >
              {line.text || '\u00A0'}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent" />
    </div>
  )
}

// ============================================
// HACKER PLAYGROUND GRID
// ============================================

const PLAYGROUND_TABS = [
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'matrix', label: 'Matrix', icon: Code },
  { id: 'network', label: 'Network', icon: Wifi },
  { id: 'breach', label: 'Breach', icon: Skull },
]

export function HackerPlaygroundGrid() {
  const [activeTab, setActiveTab] = useState('terminal')

  const renderContent = () => {
    switch (activeTab) {
      case 'terminal':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <HackerTerminal />
            <CodeRain />
          </div>
        )
      case 'matrix':
        return (
          <div className="grid md:grid-cols-1 gap-6">
            <MatrixRain />
          </div>
        )
      case 'network':
        return (
          <div className="grid md:grid-cols-1 gap-6">
            <NetworkAttackVisualizer />
          </div>
        )
      case 'breach':
        return (
          <div className="grid md:grid-cols-1 gap-6">
            <SystemBreachAnimation />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center gap-3">
        <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
        <div>
          <p className="text-sm font-medium text-yellow-500">Educational Purposes Only</p>
          <p className="text-xs text-yellow-500/70">This is a simulation for learning and demonstration. Always obtain proper authorization before security testing.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {PLAYGROUND_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              activeTab === tab.id
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                : 'bg-muted/50 hover:bg-muted text-muted-foreground'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  )
}
