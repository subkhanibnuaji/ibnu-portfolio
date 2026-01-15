import { NextResponse } from 'next/server'

const interests = [
  {
    id: '1',
    title: 'Artificial Intelligence',
    icon: 'brain',
    color: '#8B5CF6',
    description: 'Exploring the frontiers of AI, from LLMs to agentic systems',
    topics: [
      {
        name: 'Agentic AI',
        description: 'Building autonomous AI agents that can reason, plan, and execute complex tasks',
      },
      {
        name: 'LLM Workflows',
        description: 'Designing and implementing production-ready LLM pipelines',
      },
      {
        name: 'Prompt Engineering',
        description: 'Crafting effective prompts for optimal AI outputs',
      },
      {
        name: 'RAG Systems',
        description: 'Retrieval Augmented Generation for knowledge-enhanced AI',
      },
    ],
    resources: [
      { title: 'Claude API', url: 'https://anthropic.com' },
      { title: 'LangChain', url: 'https://langchain.com' },
      { title: 'OpenAI', url: 'https://openai.com' },
    ],
  },
  {
    id: '2',
    title: 'Blockchain & Crypto',
    icon: 'bitcoin',
    color: '#F59E0B',
    description: 'Active investor and builder in the decentralized ecosystem',
    topics: [
      {
        name: 'Portfolio Management',
        description: 'Strategic allocation across BTC, altcoins, and DeFi',
      },
      {
        name: 'DeFi Protocols',
        description: 'Yield farming, liquidity provision, and lending protocols',
      },
      {
        name: 'Smart Contracts',
        description: 'Development on EVM and ICP chains',
      },
      {
        name: 'Trading',
        description: '$68-100K monthly futures volume with systematic approach',
      },
    ],
    stats: [
      { label: 'Monthly Volume', value: '$68-100K' },
      { label: 'Active Chains', value: '5+' },
      { label: 'DeFi Protocols', value: '10+' },
    ],
  },
  {
    id: '3',
    title: 'Cybersecurity',
    icon: 'shield',
    color: '#10B981',
    description: 'Defensive security and threat intelligence enthusiast',
    topics: [
      {
        name: 'OSINT',
        description: 'Open Source Intelligence gathering and analysis',
      },
      {
        name: 'Threat Intelligence',
        description: 'Monitoring and analyzing emerging threats',
      },
      {
        name: 'Defensive Security',
        description: 'Building resilient systems and security architectures',
      },
      {
        name: 'Incident Response',
        description: 'Planning and executing security incident procedures',
      },
    ],
    resources: [
      { title: 'OWASP', url: 'https://owasp.org' },
      { title: 'MITRE ATT&CK', url: 'https://attack.mitre.org' },
    ],
  },
]

export async function GET() {
  return NextResponse.json({
    success: true,
    data: interests,
  })
}
