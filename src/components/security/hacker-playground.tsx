'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Terminal, Play, Pause, RotateCcw, Wifi, Globe, Server,
  Shield, AlertTriangle, Check, X, Skull, Eye, Lock, Database,
  Network, Zap, Bug, FileCode, Activity, Radio, Key, Folder,
  File, ChevronRight, Binary, Cpu, HardDrive, MemoryStick,
  Layers, Target, Trophy, Flag, Clock, Hash, Unlock, ShieldOff,
  ArrowRight, Sparkles, Flame, MapPin, Crosshair, Maximize2,
  Minimize2, Volume2, VolumeX, Keyboard
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// GLITCH TEXT EFFECT COMPONENT
// ============================================

function GlitchText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cn("relative inline-block", className)}>
      <span className="relative z-10">{text}</span>
      <span
        className="absolute top-0 left-0 -ml-[2px] text-cyan-500 opacity-70 animate-pulse"
        style={{ clipPath: 'inset(0 0 50% 0)' }}
        aria-hidden
      >
        {text}
      </span>
      <span
        className="absolute top-0 left-0 ml-[2px] text-red-500 opacity-70 animate-pulse"
        style={{ clipPath: 'inset(50% 0 0 0)', animationDelay: '0.1s' }}
        aria-hidden
      >
        {text}
      </span>
    </span>
  )
}

// ============================================
// ASCII ART BANNERS
// ============================================

const asciiArt = {
  skull: `
    ██████  ██   ██ ██    ██ ██      ██
    ██      ██  ██  ██    ██ ██      ██
    ███████ █████   ██    ██ ██      ██
         ██ ██  ██  ██    ██ ██      ██
    ███████ ██   ██  ██████  ███████ ███████
  `,
  hacker: `
  ╔═══════════════════════════════════════════╗
  ║  ██╗  ██╗ █████╗  ██████╗██╗  ██╗███████╗ ║
  ║  ██║  ██║██╔══██╗██╔════╝██║ ██╔╝██╔════╝ ║
  ║  ███████║███████║██║     █████╔╝ █████╗   ║
  ║  ██╔══██║██╔══██║██║     ██╔═██╗ ██╔══╝   ║
  ║  ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗ ║
  ║  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝ ║
  ╚═══════════════════════════════════════════╝
  `,
  access: `
  ┌─────────────────────────────────────┐
  │  █████╗  ██████╗ ██████╗███████╗███████╗███████╗
  │ ██╔══██╗██╔════╝██╔════╝██╔════╝██╔════╝██╔════╝
  │ ███████║██║     ██║     █████╗  ███████╗███████╗
  │ ██╔══██║██║     ██║     ██╔══╝  ╚════██║╚════██║
  │ ██║  ██║╚██████╗╚██████╗███████╗███████║███████║
  │ ╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚══════╝╚══════╝╚══════╝
  │         G R A N T E D
  └─────────────────────────────────────┘
  `,
}

// ============================================
// HACKING CODE SNIPPETS FOR AUTO-TYPING
// ============================================

const hackingScripts = [
  {
    title: 'Network Reconnaissance',
    code: `#!/usr/bin/env python3
# Network Reconnaissance Tool
import socket
import threading
from concurrent.futures import ThreadPoolExecutor

class NetworkScanner:
    def __init__(self, target, port_range=(1, 1024)):
        self.target = target
        self.port_range = port_range
        self.open_ports = []

    def scan_port(self, port):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex((self.target, port))
            if result == 0:
                service = socket.getservbyport(port, 'tcp')
                self.open_ports.append({'port': port, 'service': service})
                print(f"[+] Port {port} OPEN - {service}")
            sock.close()
        except:
            pass

    def run_scan(self):
        print(f"[*] Starting scan on {self.target}")
        print(f"[*] Scanning ports {self.port_range[0]}-{self.port_range[1]}")

        with ThreadPoolExecutor(max_workers=100) as executor:
            executor.map(self.scan_port, range(*self.port_range))

        print(f"[+] Scan complete. Found {len(self.open_ports)} open ports")
        return self.open_ports

scanner = NetworkScanner("192.168.1.1", (1, 1000))
results = scanner.run_scan()`,
  },
  {
    title: 'SQL Injection Detector',
    code: `// SQL Injection Vulnerability Scanner
const payloads = [
  "' OR '1'='1",
  "'; DROP TABLE users; --",
  "1' AND 1=1 --",
  "admin'--",
  "1; EXEC xp_cmdshell('dir') --",
  "' UNION SELECT NULL, username, password FROM users --"
];

async function testSQLInjection(url, param) {
  console.log(\`[*] Testing: \${url}\`);
  console.log(\`[*] Parameter: \${param}\`);

  for (const payload of payloads) {
    const testUrl = \`\${url}?\${param}=\${encodeURIComponent(payload)}\`;

    try {
      const response = await fetch(testUrl);
      const body = await response.text();

      // Check for SQL error messages
      const sqlErrors = [
        'SQL syntax',
        'mysql_fetch',
        'ORA-',
        'PostgreSQL',
        'sqlite3',
        'ODBC',
        'syntax error'
      ];

      for (const error of sqlErrors) {
        if (body.includes(error)) {
          console.log(\`[!] VULNERABLE: \${payload}\`);
          console.log(\`[!] Error detected: \${error}\`);
          return { vulnerable: true, payload, error };
        }
      }
    } catch (e) {
      console.log(\`[-] Request failed: \${e.message}\`);
    }
  }

  console.log('[+] No SQL injection detected');
  return { vulnerable: false };
}

// Start scan
testSQLInjection('https://target.com/search', 'query');`,
  },
  {
    title: 'Cryptographic Hash Cracker',
    code: `#!/usr/bin/env python3
"""
Password Hash Cracker - Educational Purpose Only
Supports: MD5, SHA1, SHA256, SHA512
"""
import hashlib
import itertools
import string
from typing import Optional

class HashCracker:
    ALGORITHMS = {
        32: 'md5',
        40: 'sha1',
        64: 'sha256',
        128: 'sha512'
    }

    def __init__(self, target_hash: str):
        self.target = target_hash.lower()
        self.algorithm = self.detect_algorithm()
        self.attempts = 0

    def detect_algorithm(self) -> str:
        return self.ALGORITHMS.get(len(self.target), 'unknown')

    def hash_string(self, text: str) -> str:
        hasher = hashlib.new(self.algorithm)
        hasher.update(text.encode())
        return hasher.hexdigest()

    def dictionary_attack(self, wordlist: list) -> Optional[str]:
        print(f"[*] Starting dictionary attack...")
        print(f"[*] Algorithm: {self.algorithm.upper()}")
        print(f"[*] Wordlist size: {len(wordlist)}")

        for word in wordlist:
            self.attempts += 1
            if self.hash_string(word) == self.target:
                print(f"[+] CRACKED: {word}")
                print(f"[+] Attempts: {self.attempts}")
                return word

        print(f"[-] Not found in wordlist")
        return None

    def brute_force(self, max_length: int = 6) -> Optional[str]:
        charset = string.ascii_lowercase + string.digits
        print(f"[*] Starting brute force...")
        print(f"[*] Max length: {max_length}")

        for length in range(1, max_length + 1):
            for combo in itertools.product(charset, repeat=length):
                attempt = ''.join(combo)
                self.attempts += 1

                if self.attempts % 100000 == 0:
                    print(f"[*] Tried: {self.attempts}")

                if self.hash_string(attempt) == self.target:
                    print(f"[+] CRACKED: {attempt}")
                    return attempt

        return None

# Target hash (MD5 of "password123")
cracker = HashCracker("482c811da5d5b4bc6d497ffa98491e38")
cracker.dictionary_attack(["admin", "password", "password123", "12345"])`,
  },
  {
    title: 'XSS Vulnerability Scanner',
    code: `// Cross-Site Scripting (XSS) Scanner
class XSSScanner {
  constructor(targetUrl) {
    this.target = targetUrl;
    this.payloads = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      '<svg onload=alert("XSS")>',
      '"><script>alert("XSS")</script>',
      "'-alert('XSS')-'",
      '<body onload=alert("XSS")>',
      '<input onfocus=alert("XSS") autofocus>',
      '{{constructor.constructor("alert(1)")()}}',
    ];
    this.results = [];
  }

  async testEndpoint(endpoint, param) {
    console.log(\`\\n[*] Testing endpoint: \${endpoint}\`);
    console.log(\`[*] Parameter: \${param}\`);

    for (const payload of this.payloads) {
      const encodedPayload = encodeURIComponent(payload);
      const testUrl = \`\${this.target}\${endpoint}?\${param}=\${encodedPayload}\`;

      try {
        const response = await fetch(testUrl, {
          method: 'GET',
          headers: { 'X-Scanner': 'XSS-Test' }
        });

        const body = await response.text();

        // Check if payload is reflected unescaped
        if (body.includes(payload) || body.includes(payload.replace(/"/g, "'"))) {
          console.log(\`[!] REFLECTED XSS FOUND!\`);
          console.log(\`[!] Payload: \${payload}\`);

          this.results.push({
            endpoint,
            param,
            payload,
            type: 'reflected',
            severity: 'HIGH'
          });
        }
      } catch (error) {
        console.log(\`[-] Error: \${error.message}\`);
      }
    }
  }

  generateReport() {
    console.log('\\n========== SCAN REPORT ==========');
    console.log(\`Total vulnerabilities: \${this.results.length}\`);
    this.results.forEach((r, i) => {
      console.log(\`\\n[\${i + 1}] \${r.type.toUpperCase()} XSS\`);
      console.log(\`    Endpoint: \${r.endpoint}\`);
      console.log(\`    Severity: \${r.severity}\`);
    });
  }
}

const scanner = new XSSScanner('https://target.com');
await scanner.testEndpoint('/search', 'q');
scanner.generateReport();`,
  },
  {
    title: 'Packet Sniffer Analysis',
    code: `#!/usr/bin/env python3
"""
Network Packet Analyzer
Captures and analyzes network traffic patterns
"""
from scapy.all import *
from collections import defaultdict
import datetime

class PacketAnalyzer:
    def __init__(self):
        self.packet_count = 0
        self.protocols = defaultdict(int)
        self.connections = defaultdict(list)
        self.suspicious = []

    def analyze_packet(self, packet):
        self.packet_count += 1
        timestamp = datetime.datetime.now().strftime("%H:%M:%S.%f")

        # Analyze IP layer
        if IP in packet:
            src = packet[IP].src
            dst = packet[IP].dst
            proto = packet[IP].proto

            # Protocol analysis
            if TCP in packet:
                self.protocols['TCP'] += 1
                sport = packet[TCP].sport
                dport = packet[TCP].dport
                flags = packet[TCP].flags

                # Detect port scanning
                if flags == 'S':  # SYN packet
                    self.connections[src].append(dport)
                    if len(set(self.connections[src])) > 20:
                        self.suspicious.append({
                            'type': 'PORT_SCAN',
                            'source': src,
                            'ports': len(self.connections[src])
                        })
                        print(f"[!] {timestamp} PORT SCAN from {src}")

                # Detect suspicious ports
                suspicious_ports = [4444, 5555, 6666, 31337]
                if dport in suspicious_ports:
                    print(f"[!] {timestamp} Suspicious: {src} -> {dst}:{dport}")

            elif UDP in packet:
                self.protocols['UDP'] += 1

            elif ICMP in packet:
                self.protocols['ICMP'] += 1
                # Detect ICMP flood
                if packet[ICMP].type == 8:
                    print(f"[*] {timestamp} ICMP Echo: {src} -> {dst}")

        # Log packet summary
        if self.packet_count % 100 == 0:
            print(f"[*] Analyzed {self.packet_count} packets")
            self.print_stats()

    def print_stats(self):
        print("\\n=== Protocol Distribution ===")
        for proto, count in self.protocols.items():
            pct = (count / self.packet_count) * 100
            print(f"  {proto}: {count} ({pct:.1f}%)")

analyzer = PacketAnalyzer()
print("[*] Starting packet capture...")
sniff(prn=analyzer.analyze_packet, count=1000)`,
  },
  {
    title: 'Privilege Escalation Check',
    code: `#!/bin/bash
# Linux Privilege Escalation Enumeration Script
# For authorized security testing only

echo "[*] Starting privilege escalation enumeration..."
echo "[*] Current user: $(whoami)"
echo "[*] Hostname: $(hostname)"
echo ""

# Check for SUID binaries
echo "=== SUID Binaries ==="
find / -perm -u=s -type f 2>/dev/null | while read binary; do
    echo "[+] Found: $binary"
    # Check GTFOBins exploitable
    case $(basename "$binary") in
        vim|vi|nano|less|more|find|awk|python*|perl|php|ruby)
            echo "[!] EXPLOITABLE: $binary"
            ;;
    esac
done

# Check sudo permissions
echo ""
echo "=== Sudo Permissions ==="
sudo -l 2>/dev/null | grep -v "not allowed"

# Check writable paths
echo ""
echo "=== Writable Directories in PATH ==="
echo $PATH | tr ':' '\\n' | while read path; do
    if [ -w "$path" ]; then
        echo "[!] Writable: $path"
    fi
done

# Check for credentials
echo ""
echo "=== Interesting Files ==="
files=(
    "/etc/passwd"
    "/etc/shadow"
    "/etc/sudoers"
    "~/.ssh/id_rsa"
    "~/.bash_history"
    "/var/log/auth.log"
)

for file in "\${files[@]}"; do
    if [ -r "$file" ]; then
        echo "[+] Readable: $file"
    fi
done

# Check running processes
echo ""
echo "=== Interesting Processes ==="
ps aux | grep -E "(root|mysql|postgres)" | grep -v grep

# Check cron jobs
echo ""
echo "=== Cron Jobs ==="
cat /etc/crontab 2>/dev/null
ls -la /etc/cron.* 2>/dev/null

echo ""
echo "[*] Enumeration complete!"`,
  },
]

// ============================================
// AUTO-TYPING TERMINAL COMPONENT
// ============================================

function AutoTypingCode({
  code,
  speed = 15,
  isActive = true,
  onComplete
}: {
  code: string
  speed?: number
  isActive?: boolean
  onComplete?: () => void
}) {
  const [displayedCode, setDisplayedCode] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    if (!isActive) return

    if (currentIndex < code.length) {
      const timer = setTimeout(() => {
        setDisplayedCode(prev => prev + code[currentIndex])
        setCurrentIndex(prev => prev + 1)

        // Auto scroll
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
      }, speed)

      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, code, speed, isActive, onComplete])

  useEffect(() => {
    setDisplayedCode('')
    setCurrentIndex(0)
  }, [code])

  return (
    <pre
      ref={containerRef}
      className="text-xs md:text-sm font-mono overflow-auto h-full scrollbar-thin scrollbar-track-transparent scrollbar-thumb-green-500/30"
    >
      <code className="text-green-400 whitespace-pre-wrap">
        {displayedCode}
        <span className="animate-pulse text-green-500">█</span>
      </code>
    </pre>
  )
}

// ============================================
// NETWORK SCAN SIMULATION
// ============================================

interface ScanResult {
  ip: string
  port: number
  service: string
  status: 'open' | 'closed' | 'filtered'
  vulnerability?: string
}

function NetworkScanSimulation({ isActive }: { isActive: boolean }) {
  const [results, setResults] = useState<ScanResult[]>([])
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTarget, setCurrentTarget] = useState('')

  const services = ['SSH', 'HTTP', 'HTTPS', 'FTP', 'SMTP', 'MySQL', 'PostgreSQL', 'Redis', 'MongoDB', 'RDP']
  const vulns = ['CVE-2024-1234', 'CVE-2023-5678', 'Weak Config', 'Default Creds', 'Outdated Version']

  useEffect(() => {
    if (!isActive) return

    setScanning(true)
    setResults([])
    setProgress(0)

    const generateResult = (index: number): ScanResult => {
      const ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      const port = [22, 80, 443, 21, 25, 3306, 5432, 6379, 27017, 3389][Math.floor(Math.random() * 10)]
      const service = services[Math.floor(Math.random() * services.length)]
      const status = Math.random() > 0.3 ? 'open' : Math.random() > 0.5 ? 'filtered' : 'closed'
      const vulnerability = status === 'open' && Math.random() > 0.6 ? vulns[Math.floor(Math.random() * vulns.length)] : undefined

      return { ip, port, service, status, vulnerability }
    }

    let index = 0
    const maxResults = 20

    const interval = setInterval(() => {
      if (index >= maxResults) {
        setScanning(false)
        clearInterval(interval)
        return
      }

      const result = generateResult(index)
      setCurrentTarget(`${result.ip}:${result.port}`)
      setResults(prev => [...prev, result])
      setProgress(((index + 1) / maxResults) * 100)
      index++
    }, 800)

    return () => clearInterval(interval)
  }, [isActive])

  return (
    <div className="space-y-3 h-full overflow-auto">
      {/* Scan Progress */}
      <div className="flex items-center gap-2 text-xs">
        <Activity className={cn("w-4 h-4", scanning ? "text-green-500 animate-pulse" : "text-muted-foreground")} />
        <span className="text-green-400 font-mono">
          {scanning ? `Scanning: ${currentTarget}` : 'Scan Complete'}
        </span>
      </div>

      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-green-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      {/* Results */}
      <div className="space-y-1 font-mono text-xs">
        <AnimatePresence>
          {results.map((result, i) => (
            <motion.div
              key={`${result.ip}-${result.port}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex items-center justify-between p-1.5 rounded",
                result.vulnerability ? "bg-red-500/10 border border-red-500/30" :
                result.status === 'open' ? "bg-green-500/10" : "bg-muted/30"
              )}
            >
              <div className="flex items-center gap-2">
                {result.status === 'open' ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : result.status === 'filtered' ? (
                  <AlertTriangle className="w-3 h-3 text-yellow-500" />
                ) : (
                  <X className="w-3 h-3 text-red-500" />
                )}
                <span className="text-green-400">{result.ip}</span>
                <span className="text-muted-foreground">:</span>
                <span className="text-cyan-400">{result.port}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{result.service}</span>
                {result.vulnerability && (
                  <span className="text-red-400 text-[10px] px-1 bg-red-500/20 rounded">
                    {result.vulnerability}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================
// MATRIX RAIN EFFECT
// ============================================

function MatrixRain({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテト'
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops: number[] = []

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#0f0'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-30"
    />
  )
}

// ============================================
// TERMINAL OUTPUT SIMULATION
// ============================================

function TerminalOutput({ isActive }: { isActive: boolean }) {
  const [lines, setLines] = useState<{ text: string; type: 'info' | 'success' | 'warning' | 'error' }[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const outputs = [
    { text: '[*] Initializing exploit framework...', type: 'info' as const },
    { text: '[*] Loading modules...', type: 'info' as const },
    { text: '[+] Module: auxiliary/scanner/portscan/tcp loaded', type: 'success' as const },
    { text: '[+] Module: exploit/multi/handler loaded', type: 'success' as const },
    { text: '[*] Setting RHOSTS to 192.168.1.0/24', type: 'info' as const },
    { text: '[*] Setting THREADS to 50', type: 'info' as const },
    { text: '[*] Starting scan...', type: 'info' as const },
    { text: '[+] 192.168.1.1:22 - SSH Open', type: 'success' as const },
    { text: '[+] 192.168.1.1:80 - HTTP Open', type: 'success' as const },
    { text: '[!] 192.168.1.5:445 - SMB vulnerable to EternalBlue', type: 'warning' as const },
    { text: '[!] 192.168.1.10:3389 - RDP BlueKeep vulnerable', type: 'warning' as const },
    { text: '[*] Checking CVE-2024-1234...', type: 'info' as const },
    { text: '[+] Vulnerability confirmed!', type: 'success' as const },
    { text: '[*] Generating payload...', type: 'info' as const },
    { text: '[-] Connection refused by target', type: 'error' as const },
    { text: '[*] Retrying with different vector...', type: 'info' as const },
    { text: '[+] Session 1 opened (192.168.1.100:4444 -> 192.168.1.5:49521)', type: 'success' as const },
    { text: '[*] Meterpreter session 1 opened', type: 'info' as const },
    { text: '[+] Privilege escalation successful', type: 'success' as const },
    { text: '[*] Dumping credentials...', type: 'info' as const },
    { text: '[+] Found 15 password hashes', type: 'success' as const },
    { text: '[*] Running post-exploitation modules...', type: 'info' as const },
    { text: '[+] Persistence established', type: 'success' as const },
    { text: '[*] Cleaning up artifacts...', type: 'info' as const },
    { text: '[+] Operation complete', type: 'success' as const },
  ]

  useEffect(() => {
    if (!isActive) return

    setLines([])
    let index = 0

    const interval = setInterval(() => {
      if (index >= outputs.length) {
        index = 0
        setLines([])
      }

      setLines(prev => [...prev.slice(-15), outputs[index]])
      index++

      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight
      }
    }, 600)

    return () => clearInterval(interval)
  }, [isActive])

  return (
    <div ref={containerRef} className="font-mono text-xs space-y-0.5 overflow-auto h-full">
      <AnimatePresence>
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              line.type === 'info' && 'text-cyan-400',
              line.type === 'success' && 'text-green-400',
              line.type === 'warning' && 'text-yellow-400',
              line.type === 'error' && 'text-red-400',
            )}
          >
            {line.text}
          </motion.div>
        ))}
      </AnimatePresence>
      <span className="text-green-500 animate-pulse">_</span>
    </div>
  )
}

// ============================================
// THREAT MONITOR DISPLAY
// ============================================

function ThreatMonitor({ isActive }: { isActive: boolean }) {
  const [threats, setThreats] = useState<{ id: number; type: string; source: string; severity: string; time: string }[]>([])

  const threatTypes = [
    { type: 'Brute Force Attack', severity: 'HIGH', icon: '🔓' },
    { type: 'SQL Injection Attempt', severity: 'CRITICAL', icon: '💉' },
    { type: 'XSS Payload Detected', severity: 'MEDIUM', icon: '📝' },
    { type: 'Port Scan Detected', severity: 'LOW', icon: '🔍' },
    { type: 'Malware Signature', severity: 'CRITICAL', icon: '🦠' },
    { type: 'Privilege Escalation', severity: 'HIGH', icon: '⬆️' },
    { type: 'Data Exfiltration', severity: 'CRITICAL', icon: '📤' },
    { type: 'Suspicious Login', severity: 'MEDIUM', icon: '🔑' },
  ]

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      const threat = threatTypes[Math.floor(Math.random() * threatTypes.length)]
      const newThreat = {
        id: Date.now(),
        type: threat.type,
        source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        severity: threat.severity,
        time: new Date().toLocaleTimeString(),
      }

      setThreats(prev => [newThreat, ...prev.slice(0, 7)])
    }, 2000)

    return () => clearInterval(interval)
  }, [isActive])

  return (
    <div className="space-y-2 font-mono text-xs">
      <div className="flex items-center gap-2 mb-3">
        <Radio className="w-4 h-4 text-red-500 animate-pulse" />
        <span className="text-red-400">LIVE THREAT MONITOR</span>
      </div>

      <AnimatePresence>
        {threats.map((threat) => (
          <motion.div
            key={threat.id}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "p-2 rounded border",
              threat.severity === 'CRITICAL' && "bg-red-500/10 border-red-500/30",
              threat.severity === 'HIGH' && "bg-orange-500/10 border-orange-500/30",
              threat.severity === 'MEDIUM' && "bg-yellow-500/10 border-yellow-500/30",
              threat.severity === 'LOW' && "bg-blue-500/10 border-blue-500/30",
            )}
          >
            <div className="flex items-center justify-between">
              <span className={cn(
                "font-bold",
                threat.severity === 'CRITICAL' && "text-red-400",
                threat.severity === 'HIGH' && "text-orange-400",
                threat.severity === 'MEDIUM' && "text-yellow-400",
                threat.severity === 'LOW' && "text-blue-400",
              )}>
                {threat.type}
              </span>
              <span className="text-muted-foreground text-[10px]">{threat.time}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-muted-foreground">Source: {threat.source}</span>
              <span className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-bold",
                threat.severity === 'CRITICAL' && "bg-red-500/20 text-red-400",
                threat.severity === 'HIGH' && "bg-orange-500/20 text-orange-400",
                threat.severity === 'MEDIUM' && "bg-yellow-500/20 text-yellow-400",
                threat.severity === 'LOW' && "bg-blue-500/20 text-blue-400",
              )}>
                {threat.severity}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// PASSWORD CRACKING SIMULATION
// ============================================

function PasswordCrackSimulation({ isActive }: { isActive: boolean }) {
  const [currentHash, setCurrentHash] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [found, setFound] = useState<{ hash: string; password: string } | null>(null)
  const [currentAttempt, setCurrentAttempt] = useState('')
  const [method, setMethod] = useState('Dictionary Attack')
  const [progress, setProgress] = useState(0)

  const commonPasswords = [
    'password', '123456', 'admin', 'letmein', 'welcome', 'monkey', 'dragon',
    'master', 'qwerty', 'login', 'passw0rd', 'abc123', 'admin123', 'root',
    'toor', 'pass', 'test', '12345678', 'password1', 'password123'
  ]

  const hashTypes = [
    { name: 'MD5', hash: '5f4dcc3b5aa765d61d8327deb882cf99', password: 'password' },
    { name: 'SHA-256', hash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', password: 'admin' },
    { name: 'NTLM', hash: 'a4f49c406510bdcab6824ee7c30fd852', password: 'password123' },
    { name: 'bcrypt', hash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.E4yMqvH', password: 'letmein' },
  ]

  useEffect(() => {
    if (!isActive) return

    const targetHash = hashTypes[Math.floor(Math.random() * hashTypes.length)]
    setCurrentHash(targetHash.hash)
    setAttempts(0)
    setFound(null)
    setProgress(0)

    let attemptCount = 0
    const maxAttempts = 150 + Math.floor(Math.random() * 100)

    const interval = setInterval(() => {
      attemptCount++
      setAttempts(attemptCount)
      setSpeed(Math.floor(1000 + Math.random() * 500))
      setProgress((attemptCount / maxAttempts) * 100)

      // Generate random attempt
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
      let attempt = ''
      if (attemptCount < maxAttempts * 0.7) {
        // Dictionary phase
        setMethod('Dictionary Attack')
        attempt = commonPasswords[Math.floor(Math.random() * commonPasswords.length)]
      } else {
        // Brute force phase
        setMethod('Brute Force')
        const len = 6 + Math.floor(Math.random() * 4)
        for (let i = 0; i < len; i++) {
          attempt += chars[Math.floor(Math.random() * chars.length)]
        }
      }
      setCurrentAttempt(attempt)

      if (attemptCount >= maxAttempts) {
        setFound({ hash: targetHash.hash, password: targetHash.password })
        clearInterval(interval)

        // Start new crack after delay
        setTimeout(() => {
          if (isActive) {
            setFound(null)
            setAttempts(0)
            setProgress(0)
            const newTarget = hashTypes[Math.floor(Math.random() * hashTypes.length)]
            setCurrentHash(newTarget.hash)
          }
        }, 3000)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [isActive])

  return (
    <div className="space-y-4 font-mono text-xs h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center gap-2 text-green-400">
        <Key className="w-4 h-4" />
        <span className="font-bold">PASSWORD HASH CRACKER</span>
      </div>

      {/* Target Hash */}
      <div className="p-3 bg-zinc-900/50 rounded-lg border border-green-500/20">
        <div className="text-muted-foreground mb-1">Target Hash:</div>
        <div className="text-cyan-400 break-all text-[10px]">{currentHash}</div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-muted-foreground">{method}</span>
          <span className="text-green-400">{progress.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-2 bg-zinc-900/50 rounded border border-zinc-800">
          <div className="text-muted-foreground text-[10px]">Attempts</div>
          <div className="text-lg font-bold text-green-400">{attempts.toLocaleString()}</div>
        </div>
        <div className="p-2 bg-zinc-900/50 rounded border border-zinc-800">
          <div className="text-muted-foreground text-[10px]">Speed</div>
          <div className="text-lg font-bold text-cyan-400">{speed}/s</div>
        </div>
      </div>

      {/* Current Attempt */}
      <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
        <div className="text-muted-foreground text-[10px] mb-1">Testing:</div>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">{currentAttempt}</span>
          <ArrowRight className="w-3 h-3 text-muted-foreground" />
          <span className="text-red-400">No match</span>
        </div>
      </div>

      {/* Rainbow Table Animation */}
      <div className="space-y-1">
        <div className="text-muted-foreground text-[10px]">Rainbow Table Lookup:</div>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-2 text-[10px]"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
          >
            <Hash className="w-3 h-3 text-purple-400" />
            <span className="text-purple-400 font-mono">
              {Array(32).fill(0).map(() => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Found Result */}
      <AnimatePresence>
        {found && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg"
          >
            <div className="flex items-center gap-2 text-green-400 font-bold mb-2">
              <Unlock className="w-5 h-5" />
              PASSWORD CRACKED!
            </div>
            <div className="text-2xl font-bold text-white">{found.password}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// BINARY DATA STREAM VISUALIZATION
// ============================================

function BinaryStreamVisualization({ isActive }: { isActive: boolean }) {
  const [packets, setPackets] = useState<{ id: number; data: string; type: string; size: number }[]>([])
  const [bandwidth, setBandwidth] = useState({ in: 0, out: 0 })
  const [totalData, setTotalData] = useState(0)

  useEffect(() => {
    if (!isActive) return

    const packetTypes = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'DNS', 'SSH', 'FTP']

    const interval = setInterval(() => {
      // Generate random binary/hex data
      const data = Array(32).fill(0).map(() =>
        Math.random() > 0.5
          ? Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
          : Math.floor(Math.random() * 2).toString()
      ).join(' ')

      const size = Math.floor(Math.random() * 1500) + 64

      setPackets(prev => [{
        id: Date.now(),
        data,
        type: packetTypes[Math.floor(Math.random() * packetTypes.length)],
        size,
      }, ...prev.slice(0, 8)])

      setBandwidth({
        in: Math.floor(Math.random() * 50) + 10,
        out: Math.floor(Math.random() * 30) + 5,
      })

      setTotalData(prev => prev + size)
    }, 300)

    return () => clearInterval(interval)
  }, [isActive])

  return (
    <div className="space-y-4 font-mono text-xs h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-cyan-400">
          <Binary className="w-4 h-4" />
          <span className="font-bold">PACKET CAPTURE</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-green-400">↓ {bandwidth.in} MB/s</span>
          <span className="text-orange-400">↑ {bandwidth.out} MB/s</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 bg-zinc-900/50 rounded border border-cyan-500/20 text-center">
          <Cpu className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
          <div className="text-[10px] text-muted-foreground">CPU</div>
          <div className="text-cyan-400 font-bold">{Math.floor(Math.random() * 30 + 20)}%</div>
        </div>
        <div className="p-2 bg-zinc-900/50 rounded border border-purple-500/20 text-center">
          <MemoryStick className="w-4 h-4 mx-auto mb-1 text-purple-400" />
          <div className="text-[10px] text-muted-foreground">Memory</div>
          <div className="text-purple-400 font-bold">{Math.floor(Math.random() * 20 + 40)}%</div>
        </div>
        <div className="p-2 bg-zinc-900/50 rounded border border-green-500/20 text-center">
          <HardDrive className="w-4 h-4 mx-auto mb-1 text-green-400" />
          <div className="text-[10px] text-muted-foreground">Captured</div>
          <div className="text-green-400 font-bold">{(totalData / 1024).toFixed(1)} KB</div>
        </div>
      </div>

      {/* Packet Stream */}
      <div className="space-y-1">
        <AnimatePresence>
          {packets.map((packet) => (
            <motion.div
              key={packet.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20 }}
              className="p-2 bg-zinc-900/70 rounded border border-zinc-800 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-[10px] font-bold",
                  packet.type === 'HTTPS' && "bg-green-500/20 text-green-400",
                  packet.type === 'HTTP' && "bg-blue-500/20 text-blue-400",
                  packet.type === 'TCP' && "bg-cyan-500/20 text-cyan-400",
                  packet.type === 'UDP' && "bg-purple-500/20 text-purple-400",
                  packet.type === 'DNS' && "bg-yellow-500/20 text-yellow-400",
                  packet.type === 'SSH' && "bg-orange-500/20 text-orange-400",
                  packet.type === 'FTP' && "bg-red-500/20 text-red-400",
                )}>
                  {packet.type}
                </span>
                <span className="text-muted-foreground text-[10px]">{packet.size} bytes</span>
              </div>
              <div className="text-[10px] text-green-400/70 font-mono break-all leading-tight">
                {packet.data}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Hex Dump Visualization */}
      <div className="p-2 bg-zinc-900/50 rounded border border-zinc-800">
        <div className="text-[10px] text-muted-foreground mb-1">Hex Dump:</div>
        <div className="grid grid-cols-16 gap-0.5 text-[8px]">
          {[...Array(64)].map((_, i) => (
            <motion.span
              key={i}
              className="text-green-400"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.3, delay: i * 0.02, repeat: Infinity }}
            >
              {Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// SYSTEM TAKEOVER SIMULATION
// ============================================

function SystemTakeoverSimulation({ isActive }: { isActive: boolean }) {
  const [phase, setPhase] = useState(0)
  const [fileTree, setFileTree] = useState<{ name: string; type: 'folder' | 'file'; accessed: boolean }[]>([])
  const [accessLevel, setAccessLevel] = useState('guest')
  const [systemInfo, setSystemInfo] = useState({ os: '', kernel: '', hostname: '' })
  const [logs, setLogs] = useState<string[]>([])

  const phases = [
    'Reconnaissance',
    'Initial Access',
    'Privilege Escalation',
    'Lateral Movement',
    'Data Exfiltration',
    'Persistence',
  ]

  const files = [
    { name: 'etc', type: 'folder' as const },
    { name: 'passwd', type: 'file' as const },
    { name: 'shadow', type: 'file' as const },
    { name: 'home', type: 'folder' as const },
    { name: 'user', type: 'folder' as const },
    { name: '.ssh', type: 'folder' as const },
    { name: 'id_rsa', type: 'file' as const },
    { name: 'var', type: 'folder' as const },
    { name: 'log', type: 'folder' as const },
    { name: 'auth.log', type: 'file' as const },
    { name: 'root', type: 'folder' as const },
    { name: '.bash_history', type: 'file' as const },
  ]

  useEffect(() => {
    if (!isActive) return

    setPhase(0)
    setFileTree(files.map(f => ({ ...f, accessed: false })))
    setAccessLevel('guest')
    setLogs([])
    setSystemInfo({
      os: 'Ubuntu 22.04 LTS',
      kernel: '5.15.0-generic',
      hostname: 'target-server',
    })

    let currentPhase = 0
    let fileIndex = 0

    const phaseInterval = setInterval(() => {
      if (currentPhase < phases.length) {
        setPhase(currentPhase)
        setLogs(prev => [...prev, `[*] Phase ${currentPhase + 1}: ${phases[currentPhase]}`])

        // Update access level
        if (currentPhase === 2) setAccessLevel('user')
        if (currentPhase >= 3) setAccessLevel('root')

        currentPhase++
      } else {
        currentPhase = 0
        setPhase(0)
        setFileTree(files.map(f => ({ ...f, accessed: false })))
        setAccessLevel('guest')
        setLogs([])
      }
    }, 4000)

    const fileInterval = setInterval(() => {
      if (fileIndex < files.length) {
        setFileTree(prev => prev.map((f, i) =>
          i === fileIndex ? { ...f, accessed: true } : f
        ))
        setLogs(prev => [...prev.slice(-8), `[+] Accessed: /${files[fileIndex].name}`])
        fileIndex++
      } else {
        fileIndex = 0
      }
    }, 1500)

    return () => {
      clearInterval(phaseInterval)
      clearInterval(fileInterval)
    }
  }, [isActive])

  return (
    <div className="space-y-4 font-mono text-xs h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-red-400">
          <Skull className="w-4 h-4" />
          <span className="font-bold">SYSTEM TAKEOVER</span>
        </div>
        <div className={cn(
          "px-2 py-1 rounded text-[10px] font-bold",
          accessLevel === 'guest' && "bg-gray-500/20 text-gray-400",
          accessLevel === 'user' && "bg-yellow-500/20 text-yellow-400",
          accessLevel === 'root' && "bg-red-500/20 text-red-400",
        )}>
          {accessLevel.toUpperCase()}
        </div>
      </div>

      {/* Phase Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground">Attack Phase</span>
          <span className="text-red-400">{phases[phase]}</span>
        </div>
        <div className="flex gap-1">
          {phases.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 flex-1 rounded-full transition-colors",
                i <= phase ? "bg-red-500" : "bg-zinc-800"
              )}
            />
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="p-3 bg-zinc-900/50 rounded-lg border border-red-500/20">
        <div className="grid grid-cols-3 gap-2 text-[10px]">
          <div>
            <div className="text-muted-foreground">OS</div>
            <div className="text-cyan-400">{systemInfo.os}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Kernel</div>
            <div className="text-cyan-400">{systemInfo.kernel}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Host</div>
            <div className="text-cyan-400">{systemInfo.hostname}</div>
          </div>
        </div>
      </div>

      {/* File System Tree */}
      <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
        <div className="text-[10px] text-muted-foreground mb-2">File System Access:</div>
        <div className="space-y-0.5">
          {fileTree.map((file, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-1"
              animate={file.accessed ? { x: [0, 5, 0] } : {}}
            >
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
              {file.type === 'folder' ? (
                <Folder className={cn("w-3 h-3", file.accessed ? "text-yellow-400" : "text-blue-400")} />
              ) : (
                <File className={cn("w-3 h-3", file.accessed ? "text-red-400" : "text-gray-400")} />
              )}
              <span className={cn(
                "text-[10px]",
                file.accessed ? "text-green-400" : "text-muted-foreground"
              )}>
                {file.name}
                {file.accessed && <span className="text-red-400 ml-1">*</span>}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live Logs */}
      <div className="p-2 bg-black rounded border border-zinc-800 h-24 overflow-auto">
        {logs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "text-[10px]",
              log.includes('[+]') && "text-green-400",
              log.includes('[*]') && "text-cyan-400",
              log.includes('[!]') && "text-yellow-400",
            )}
          >
            {log}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// CTF MINI CHALLENGE
// ============================================

function CTFChallenge({ isActive }: { isActive: boolean }) {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [input, setInput] = useState('')
  const [solved, setSolved] = useState<number[]>([])
  const [hint, setHint] = useState('')
  const [showFlag, setShowFlag] = useState(false)
  const [points, setPoints] = useState(0)

  const challenges = [
    {
      title: 'Base64 Decode',
      category: 'Crypto',
      difficulty: 'Easy',
      points: 100,
      description: 'Decode this Base64 string to find the flag:',
      cipher: 'ZmxhZ3tiYXNlNjRfaXNfbm90X2VuY3J5cHRpb259',
      answer: 'flag{base64_is_not_encryption}',
      hint: 'Use a Base64 decoder. The result is the flag!',
    },
    {
      title: 'Caesar Cipher',
      category: 'Crypto',
      difficulty: 'Easy',
      points: 150,
      description: 'Decrypt this Caesar cipher (shift of 13):',
      cipher: 'synt{ebg13_vf_abg_frpher}',
      answer: 'flag{rot13_is_not_secure}',
      hint: 'ROT13 is a Caesar cipher with a shift of 13.',
    },
    {
      title: 'Hex Decode',
      category: 'Crypto',
      difficulty: 'Easy',
      points: 100,
      description: 'Convert this hex to ASCII:',
      cipher: '666c61677b6865785f656e636f64696e677d',
      answer: 'flag{hex_encoding}',
      hint: 'Each pair of hex digits represents one character.',
    },
    {
      title: 'Binary Decode',
      category: 'Crypto',
      difficulty: 'Medium',
      points: 200,
      description: 'Decode this binary:',
      cipher: '01100110 01101100 01100001 01100111',
      answer: 'flag',
      hint: 'Each 8 bits represents one ASCII character.',
    },
  ]

  const handleSubmit = () => {
    const challenge = challenges[currentChallenge]
    if (input.toLowerCase().trim() === challenge.answer.toLowerCase()) {
      if (!solved.includes(currentChallenge)) {
        setSolved(prev => [...prev, currentChallenge])
        setPoints(prev => prev + challenge.points)
      }
      setShowFlag(true)
      setTimeout(() => {
        setShowFlag(false)
        setInput('')
        setHint('')
        setCurrentChallenge((currentChallenge + 1) % challenges.length)
      }, 2000)
    } else {
      setHint('Incorrect! Try again.')
    }
  }

  const challenge = challenges[currentChallenge]

  return (
    <div className="space-y-4 font-mono text-xs h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-yellow-400">
          <Flag className="w-4 h-4" />
          <span className="font-bold">CTF CHALLENGE</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-yellow-400 font-bold">{points} pts</span>
        </div>
      </div>

      {/* Challenge Progress */}
      <div className="flex gap-1">
        {challenges.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 flex-1 rounded-full",
              solved.includes(i) ? "bg-green-500" :
              i === currentChallenge ? "bg-yellow-500" : "bg-zinc-800"
            )}
          />
        ))}
      </div>

      {/* Challenge Card */}
      <div className="p-4 bg-zinc-900/50 rounded-lg border border-yellow-500/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-bold text-white">{challenge.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded text-[10px]">
                {challenge.category}
              </span>
              <span className={cn(
                "px-1.5 py-0.5 rounded text-[10px]",
                challenge.difficulty === 'Easy' && "bg-green-500/20 text-green-400",
                challenge.difficulty === 'Medium' && "bg-yellow-500/20 text-yellow-400",
                challenge.difficulty === 'Hard' && "bg-red-500/20 text-red-400",
              )}>
                {challenge.difficulty}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-yellow-400 font-bold">{challenge.points}</div>
            <div className="text-[10px] text-muted-foreground">points</div>
          </div>
        </div>

        <p className="text-muted-foreground mb-3">{challenge.description}</p>

        <div className="p-3 bg-black rounded border border-zinc-800 mb-3">
          <code className="text-green-400 break-all">{challenge.cipher}</code>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter flag..."
            className="flex-1 px-3 py-2 bg-black border border-zinc-700 rounded focus:border-yellow-500 focus:outline-none text-white"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400 transition-colors"
          >
            Submit
          </button>
        </div>

        {/* Hint Button */}
        <button
          onClick={() => setHint(challenge.hint)}
          className="mt-2 text-[10px] text-muted-foreground hover:text-yellow-400"
        >
          Need a hint?
        </button>

        {hint && (
          <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-400 text-[10px]">
            {hint}
          </div>
        )}
      </div>

      {/* Success Animation */}
      <AnimatePresence>
        {showFlag && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          >
            <div className="p-8 bg-zinc-900 rounded-xl border border-green-500 text-center">
              <Sparkles className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <div className="text-2xl font-bold text-green-400">FLAG CAPTURED!</div>
              <div className="text-yellow-400 mt-2">+{challenge.points} points</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// FIREWALL BYPASS VISUALIZATION
// ============================================

function FirewallBypassVisualization({ isActive }: { isActive: boolean }) {
  const [packets, setPackets] = useState<{ id: number; blocked: boolean; technique: string }[]>([])
  const [bypassAttempts, setBypassAttempts] = useState(0)
  const [successRate, setSuccessRate] = useState(0)
  const [currentTechnique, setCurrentTechnique] = useState('')
  const [firewallRules, setFirewallRules] = useState<{ port: number; action: 'ALLOW' | 'DENY' }[]>([])

  const techniques = [
    'Port Hopping',
    'Protocol Tunneling',
    'IP Fragmentation',
    'SSL/TLS Encryption',
    'DNS Tunneling',
    'HTTP Header Manipulation',
    'Steganography',
    'Timing-based Evasion',
  ]

  useEffect(() => {
    if (!isActive) return

    // Initialize firewall rules
    setFirewallRules([
      { port: 22, action: 'DENY' },
      { port: 23, action: 'DENY' },
      { port: 80, action: 'ALLOW' },
      { port: 443, action: 'ALLOW' },
      { port: 3389, action: 'DENY' },
      { port: 8080, action: 'DENY' },
    ])

    let attempts = 0
    let successes = 0

    const interval = setInterval(() => {
      const technique = techniques[Math.floor(Math.random() * techniques.length)]
      const blocked = Math.random() > 0.6 // 40% success rate

      attempts++
      if (!blocked) successes++

      setBypassAttempts(attempts)
      setSuccessRate(Math.round((successes / attempts) * 100))
      setCurrentTechnique(technique)

      setPackets(prev => [{
        id: Date.now(),
        blocked,
        technique,
      }, ...prev.slice(0, 6)])
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive])

  return (
    <div className="space-y-4 font-mono text-xs h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-orange-400">
          <ShieldOff className="w-4 h-4" />
          <span className="font-bold">FIREWALL EVASION</span>
        </div>
        <div className="text-[10px] text-muted-foreground">
          Success Rate: <span className="text-green-400">{successRate}%</span>
        </div>
      </div>

      {/* Firewall Visualization */}
      <div className="relative p-4 bg-zinc-900/50 rounded-lg border border-orange-500/20">
        <div className="flex items-center justify-between">
          {/* Source */}
          <div className="text-center">
            <Cpu className="w-8 h-8 text-cyan-400 mx-auto" />
            <div className="text-[10px] text-muted-foreground mt-1">Attacker</div>
          </div>

          {/* Firewall */}
          <div className="flex-1 mx-4 relative">
            <div className="h-16 bg-gradient-to-r from-red-500/20 via-orange-500/30 to-red-500/20 rounded border-2 border-orange-500 flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-500" />
              <span className="ml-2 text-orange-400 font-bold">FIREWALL</span>
            </div>

            {/* Packet Animation */}
            <AnimatePresence>
              {packets.slice(0, 3).map((packet, i) => (
                <motion.div
                  key={packet.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{
                    x: packet.blocked ? 0 : 200,
                    opacity: packet.blocked ? 0 : 1,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ top: `${30 + i * 15}%` }}
                >
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    packet.blocked ? "bg-red-500" : "bg-green-500"
                  )} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Target */}
          <div className="text-center">
            <Server className="w-8 h-8 text-green-400 mx-auto" />
            <div className="text-[10px] text-muted-foreground mt-1">Target</div>
          </div>
        </div>
      </div>

      {/* Current Technique */}
      <div className="p-3 bg-zinc-900/50 rounded border border-zinc-800">
        <div className="text-[10px] text-muted-foreground mb-1">Current Technique:</div>
        <div className="text-cyan-400 font-bold flex items-center gap-2">
          <Layers className="w-4 h-4" />
          {currentTechnique}
        </div>
      </div>

      {/* Firewall Rules */}
      <div className="p-3 bg-zinc-900/50 rounded border border-zinc-800">
        <div className="text-[10px] text-muted-foreground mb-2">Detected Rules:</div>
        <div className="grid grid-cols-2 gap-1">
          {firewallRules.map((rule, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center justify-between p-1.5 rounded text-[10px]",
                rule.action === 'ALLOW' ? "bg-green-500/10" : "bg-red-500/10"
              )}
            >
              <span className="text-muted-foreground">Port {rule.port}</span>
              <span className={rule.action === 'ALLOW' ? "text-green-400" : "text-red-400"}>
                {rule.action}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Attempt Log */}
      <div className="space-y-1">
        <AnimatePresence>
          {packets.map((packet) => (
            <motion.div
              key={packet.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "flex items-center justify-between p-2 rounded text-[10px]",
                packet.blocked ? "bg-red-500/10 border border-red-500/30" : "bg-green-500/10 border border-green-500/30"
              )}
            >
              <span className="text-muted-foreground">{packet.technique}</span>
              <span className={packet.blocked ? "text-red-400" : "text-green-400"}>
                {packet.blocked ? "BLOCKED" : "BYPASSED"}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================
// WORLD MAP ATTACK VISUALIZATION
// ============================================

interface Attack {
  id: number
  from: { x: number; y: number; country: string; city: string }
  to: { x: number; y: number }
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

function WorldMapAttacks({ isActive }: { isActive: boolean }) {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [stats, setStats] = useState({ total: 0, blocked: 0, countries: 0 })
  const [topCountries, setTopCountries] = useState<{ country: string; count: number }[]>([])

  const locations = [
    { x: 15, y: 35, country: 'Russia', city: 'Moscow' },
    { x: 85, y: 25, country: 'China', city: 'Beijing' },
    { x: 75, y: 45, country: 'India', city: 'Mumbai' },
    { x: 5, y: 55, country: 'Brazil', city: 'São Paulo' },
    { x: 50, y: 30, country: 'Iran', city: 'Tehran' },
    { x: 80, y: 60, country: 'Indonesia', city: 'Jakarta' },
    { x: 55, y: 50, country: 'Nigeria', city: 'Lagos' },
    { x: 65, y: 35, country: 'Pakistan', city: 'Karachi' },
    { x: 25, y: 25, country: 'Ukraine', city: 'Kyiv' },
    { x: 90, y: 35, country: 'North Korea', city: 'Pyongyang' },
    { x: 30, y: 40, country: 'Turkey', city: 'Istanbul' },
    { x: 10, y: 40, country: 'Argentina', city: 'Buenos Aires' },
  ]

  const attackTypes = [
    'DDoS Attack',
    'Brute Force',
    'SQL Injection',
    'Malware C2',
    'Phishing',
    'Ransomware',
    'Zero-Day Exploit',
    'APT Campaign',
  ]

  const severities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical']

  useEffect(() => {
    if (!isActive) return

    const countryCounts: Record<string, number> = {}

    const interval = setInterval(() => {
      const from = locations[Math.floor(Math.random() * locations.length)]
      const severity = severities[Math.floor(Math.random() * severities.length)]

      const newAttack: Attack = {
        id: Date.now() + Math.random(),
        from,
        to: { x: 45, y: 45 }, // Target (center - your server)
        type: attackTypes[Math.floor(Math.random() * attackTypes.length)],
        severity,
      }

      countryCounts[from.country] = (countryCounts[from.country] || 0) + 1

      setAttacks(prev => [newAttack, ...prev.slice(0, 5)])
      setStats(prev => ({
        total: prev.total + 1,
        blocked: prev.blocked + (Math.random() > 0.3 ? 1 : 0),
        countries: Object.keys(countryCounts).length,
      }))

      setTopCountries(
        Object.entries(countryCounts)
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
      )
    }, 1500)

    return () => clearInterval(interval)
  }, [isActive])

  return (
    <div className="space-y-4 font-mono text-xs h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-red-400">
          <Globe className="w-4 h-4 animate-pulse" />
          <span className="font-bold">GLOBAL THREAT MAP</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-red-400 animate-pulse">● LIVE</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 bg-zinc-900/50 rounded border border-red-500/20 text-center">
          <div className="text-lg font-bold text-red-400">{stats.total}</div>
          <div className="text-[10px] text-muted-foreground">Attacks</div>
        </div>
        <div className="p-2 bg-zinc-900/50 rounded border border-green-500/20 text-center">
          <div className="text-lg font-bold text-green-400">{stats.blocked}</div>
          <div className="text-[10px] text-muted-foreground">Blocked</div>
        </div>
        <div className="p-2 bg-zinc-900/50 rounded border border-cyan-500/20 text-center">
          <div className="text-lg font-bold text-cyan-400">{stats.countries}</div>
          <div className="text-[10px] text-muted-foreground">Countries</div>
        </div>
      </div>

      {/* World Map Visualization */}
      <div className="relative h-48 bg-zinc-900/50 rounded-lg border border-zinc-800 overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full h-px bg-green-500" style={{ top: `${i * 10}%` }} />
          ))}
          {[...Array(10)].map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full w-px bg-green-500" style={{ left: `${i * 10}%` }} />
          ))}
        </div>

        {/* Target (your server) */}
        <motion.div
          className="absolute w-4 h-4 -ml-2 -mt-2"
          style={{ left: '45%', top: '45%' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-full h-full rounded-full bg-green-500 opacity-50" />
          <div className="absolute inset-1 rounded-full bg-green-400" />
        </motion.div>

        {/* Attack Lines */}
        <AnimatePresence>
          {attacks.map((attack) => (
            <motion.div
              key={attack.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute"
              style={{
                left: `${attack.from.x}%`,
                top: `${attack.from.y}%`,
              }}
            >
              {/* Origin point */}
              <motion.div
                className={cn(
                  "absolute w-2 h-2 -ml-1 -mt-1 rounded-full",
                  attack.severity === 'critical' && "bg-red-500",
                  attack.severity === 'high' && "bg-orange-500",
                  attack.severity === 'medium' && "bg-yellow-500",
                  attack.severity === 'low' && "bg-blue-500",
                )}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />

              {/* Attack line (SVG) */}
              <svg
                className="absolute pointer-events-none"
                style={{
                  width: '100%',
                  height: '100%',
                  left: 0,
                  top: 0,
                  overflow: 'visible',
                }}
              >
                <motion.line
                  x1="0"
                  y1="0"
                  x2={`${(attack.to.x - attack.from.x) * 3}px`}
                  y2={`${(attack.to.y - attack.from.y) * 3}px`}
                  stroke={
                    attack.severity === 'critical' ? '#ef4444' :
                    attack.severity === 'high' ? '#f97316' :
                    attack.severity === 'medium' ? '#eab308' : '#3b82f6'
                  }
                  strokeWidth="1"
                  strokeDasharray="4 2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                  transition={{ duration: 2 }}
                />
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Map Label */}
        <div className="absolute bottom-2 left-2 text-[10px] text-muted-foreground">
          Real-time Attack Visualization
        </div>
      </div>

      {/* Top Attacking Countries */}
      <div className="p-3 bg-zinc-900/50 rounded border border-zinc-800">
        <div className="text-[10px] text-muted-foreground mb-2">Top Threat Origins:</div>
        <div className="space-y-1">
          {topCountries.map((c, i) => (
            <div key={c.country} className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{i + 1}.</span>
                <MapPin className="w-3 h-3 text-red-400" />
                <span className="text-white">{c.country}</span>
              </div>
              <span className="text-red-400">{c.count} attacks</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Attack Log */}
      <div className="space-y-1">
        <AnimatePresence>
          {attacks.slice(0, 3).map((attack) => (
            <motion.div
              key={attack.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "flex items-center justify-between p-2 rounded text-[10px] border",
                attack.severity === 'critical' && "bg-red-500/10 border-red-500/30",
                attack.severity === 'high' && "bg-orange-500/10 border-orange-500/30",
                attack.severity === 'medium' && "bg-yellow-500/10 border-yellow-500/30",
                attack.severity === 'low' && "bg-blue-500/10 border-blue-500/30",
              )}
            >
              <div className="flex items-center gap-2">
                <Crosshair className="w-3 h-3" />
                <span>{attack.from.city}, {attack.from.country}</span>
              </div>
              <span className={cn(
                attack.severity === 'critical' && "text-red-400",
                attack.severity === 'high' && "text-orange-400",
                attack.severity === 'medium' && "text-yellow-400",
                attack.severity === 'low' && "text-blue-400",
              )}>
                {attack.type}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================
// MAIN HACKER PLAYGROUND COMPONENT
// ============================================

type PlaygroundMode = 'code' | 'scan' | 'terminal' | 'threats' | 'crack' | 'binary' | 'takeover' | 'ctf' | 'firewall' | 'worldmap'

export function HackerPlayground() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0)
  const [mode, setMode] = useState<PlaygroundMode>('code')
  const [showMatrix, setShowMatrix] = useState(true)
  const [showKeyboardHints, setShowKeyboardHints] = useState(false)

  const handleNextScript = useCallback(() => {
    setCurrentScriptIndex(prev => (prev + 1) % hackingScripts.length)
  }, [])

  const handleReset = () => {
    setCurrentScriptIndex(0)
    setIsPlaying(true)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const modeKeys: Record<string, PlaygroundMode> = {
      '1': 'code',
      '2': 'scan',
      '3': 'terminal',
      '4': 'threats',
      '5': 'crack',
      '6': 'binary',
      '7': 'takeover',
      '8': 'ctf',
      '9': 'firewall',
      '0': 'worldmap',
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (modeKeys[e.key]) {
        setMode(modeKeys[e.key])
      } else if (e.key === ' ') {
        e.preventDefault()
        setIsPlaying(prev => !prev)
      } else if (e.key === 'm') {
        setShowMatrix(prev => !prev)
      } else if (e.key === 'r') {
        handleReset()
      } else if (e.key === '?') {
        setShowKeyboardHints(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const modes: { id: PlaygroundMode; label: string; icon: typeof Terminal }[] = [
    { id: 'code', label: 'Live Coding', icon: FileCode },
    { id: 'scan', label: 'Network Scan', icon: Network },
    { id: 'terminal', label: 'Exploit Run', icon: Terminal },
    { id: 'threats', label: 'Threat Feed', icon: Shield },
    { id: 'crack', label: 'Hash Crack', icon: Key },
    { id: 'binary', label: 'Packet Capture', icon: Binary },
    { id: 'takeover', label: 'System Pwn', icon: Skull },
    { id: 'ctf', label: 'CTF Challenge', icon: Flag },
    { id: 'firewall', label: 'Firewall Bypass', icon: ShieldOff },
    { id: 'worldmap', label: 'Global Threats', icon: Globe },
  ]

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Skull className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="font-bold text-lg">
              <GlitchText text="Ethical Hacker Playground" className="text-green-400" />
            </h3>
            <p className="text-xs text-muted-foreground">Live security demonstration & showcase</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeyboardHints(!showKeyboardHints)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              showKeyboardHints ? "bg-cyan-500/20 text-cyan-400" : "bg-muted text-muted-foreground"
            )}
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowMatrix(!showMatrix)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              showMatrix ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"
            )}
            title="Toggle Matrix Effect (M)"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            title="Reset (R)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              mode === m.id
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <m.icon className="w-4 h-4" />
            {m.label}
          </button>
        ))}
      </div>

      {/* Main Terminal Window */}
      <div className="relative rounded-xl overflow-hidden border border-green-500/30 bg-black">
        {/* Matrix Background */}
        {showMatrix && <MatrixRain active={isPlaying} />}

        {/* Terminal Header */}
        <div className="relative z-10 flex items-center justify-between px-4 py-2 bg-zinc-900/90 border-b border-green-500/20">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="text-xs font-mono text-green-400 flex items-center gap-2">
            <Terminal className="w-3 h-3" />
            {mode === 'code' && hackingScripts[currentScriptIndex].title}
            {mode === 'scan' && 'Network Scanner v2.1'}
            {mode === 'terminal' && 'Metasploit Framework'}
            {mode === 'threats' && 'Security Operations Center'}
            {mode === 'crack' && 'Hashcat / John the Ripper'}
            {mode === 'binary' && 'Wireshark Packet Analyzer'}
            {mode === 'takeover' && 'Cobalt Strike Beacon'}
            {mode === 'ctf' && 'CTF Platform - Capture The Flag'}
            {mode === 'firewall' && 'Firewall Evasion Framework'}
            {mode === 'worldmap' && 'Global Threat Intelligence'}
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            {mode === 'code' && `${currentScriptIndex + 1}/${hackingScripts.length}`}
          </div>
        </div>

        {/* Content Area */}
        <div className="relative z-10 h-[400px] md:h-[500px] p-4 bg-black/70">
          {mode === 'code' && (
            <AutoTypingCode
              code={hackingScripts[currentScriptIndex].code}
              speed={12}
              isActive={isPlaying}
              onComplete={handleNextScript}
            />
          )}
          {mode === 'scan' && <NetworkScanSimulation isActive={isPlaying} />}
          {mode === 'terminal' && <TerminalOutput isActive={isPlaying} />}
          {mode === 'threats' && <ThreatMonitor isActive={isPlaying} />}
          {mode === 'crack' && <PasswordCrackSimulation isActive={isPlaying} />}
          {mode === 'binary' && <BinaryStreamVisualization isActive={isPlaying} />}
          {mode === 'takeover' && <SystemTakeoverSimulation isActive={isPlaying} />}
          {mode === 'ctf' && <CTFChallenge isActive={isPlaying} />}
          {mode === 'firewall' && <FirewallBypassVisualization isActive={isPlaying} />}
          {mode === 'worldmap' && <WorldMapAttacks isActive={isPlaying} />}
        </div>

        {/* Status Bar */}
        <div className="relative z-10 flex items-center justify-between px-4 py-2 bg-zinc-900/90 border-t border-green-500/20 text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-green-400">
              <Zap className="w-3 h-3" />
              Active
            </span>
            <span className="text-muted-foreground">
              {mode === 'code' && 'Python / JavaScript / Bash'}
              {mode === 'scan' && 'Nmap-style Scanner'}
              {mode === 'terminal' && 'msf6 >'}
              {mode === 'threats' && 'Real-time Monitoring'}
              {mode === 'crack' && 'Rainbow Tables + Brute Force'}
              {mode === 'binary' && 'libpcap / tcpdump'}
              {mode === 'takeover' && 'Post-Exploitation Framework'}
              {mode === 'ctf' && 'Crypto / Web / Forensics'}
              {mode === 'firewall' && 'IDS/IPS Evasion'}
              {mode === 'worldmap' && 'Real-time Threat Intelligence'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Server className="w-3 h-3" />
              192.168.1.100
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-green-500" />
              Encrypted
            </span>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Overlay */}
      <AnimatePresence>
        {showKeyboardHints && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-4 bg-zinc-900/90 border border-cyan-500/30 rounded-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <Keyboard className="w-4 h-4" />
                <span className="font-bold text-sm">Keyboard Shortcuts</span>
              </div>
              <button
                onClick={() => setShowKeyboardHints(false)}
                className="text-muted-foreground hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              <div className="space-y-1">
                <div className="text-muted-foreground">Modes:</div>
                <div><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">1</kbd> Live Coding</div>
                <div><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">2</kbd> Network Scan</div>
                <div><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">3</kbd> Exploit Run</div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground">&nbsp;</div>
                <div><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">4</kbd> Threat Feed</div>
                <div><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">5</kbd> Hash Crack</div>
                <div><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">6</kbd> Packet Capture</div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground">&nbsp;</div>
                <div><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">7</kbd> System Pwn</div>
                <div><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">8</kbd> CTF Challenge</div>
                <div><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">9</kbd> Firewall Bypass</div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground">Controls:</div>
                <div><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">0</kbd> Global Threats</div>
                <div><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">Space</kbd> Play/Pause</div>
                <div><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">M</kbd> Matrix Effect</div>
                <div><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">R</kbd> Reset</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disclaimer */}
      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            <span className="font-bold text-yellow-500">Educational Purpose Only:</span> This is a simulation/showcase demonstrating security concepts and coding patterns.
            All code examples are for learning purposes. Always obtain proper authorization before testing security on any system.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HackerPlayground
