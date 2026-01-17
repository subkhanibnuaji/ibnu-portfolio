'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Bitcoin, Wallet, TrendingUp, Shield, Globe, Zap, ArrowRight,
  Coins, BarChart3, Lock, Network, FileCode, Cpu, Wrench,
  Calculator, ArrowRightLeft
} from 'lucide-react'
import { BitcoinWidget } from '@/components/pillars/bitcoin-widget'
import { CryptoPriceTicker } from '@/components/pillars/crypto-price-ticker'
import { CryptoPriceGrid } from '@/components/pillars/crypto-price-grid'
import { NewsFeed } from '@/components/pillars/news-feed'
import { CryptoToolsGrid } from '@/components/crypto/crypto-tools'

const features = [
  {
    icon: Shield,
    title: 'Decentralization',
    description: 'No single point of failure. Distributed ledger technology ensures trustless transactions.',
  },
  {
    icon: Lock,
    title: 'Cryptographic Security',
    description: 'Military-grade encryption protects all transactions and data on the blockchain.',
  },
  {
    icon: Globe,
    title: 'Borderless',
    description: 'Send and receive value anywhere in the world, 24/7, without intermediaries.',
  },
  {
    icon: Zap,
    title: 'Instant Settlement',
    description: 'Transactions settle in minutes or seconds, not days like traditional finance.',
  },
]

const blockchainPlatforms = [
  {
    name: 'Bitcoin',
    description: 'The original cryptocurrency and digital gold standard.',
    color: 'from-orange-500 to-yellow-500',
    icon: '₿',
  },
  {
    name: 'Ethereum',
    description: 'Smart contracts and decentralized applications platform.',
    color: 'from-blue-500 to-purple-500',
    icon: 'Ξ',
  },
  {
    name: 'Solana',
    description: 'High-performance blockchain for DeFi and NFTs.',
    color: 'from-purple-500 to-pink-500',
    icon: '◎',
  },
  {
    name: 'Internet Computer',
    description: 'Web3 platform for building decentralized applications.',
    color: 'from-indigo-500 to-blue-500',
    icon: '∞',
  },
]

const useCases = [
  { icon: Wallet, title: 'DeFi', description: 'Decentralized Finance protocols' },
  { icon: FileCode, title: 'Smart Contracts', description: 'Self-executing agreements' },
  { icon: Network, title: 'NFTs', description: 'Digital ownership & art' },
  { icon: Cpu, title: 'Web3', description: 'Decentralized internet' },
  { icon: Coins, title: 'Stablecoins', description: 'Price-stable cryptocurrencies' },
  { icon: BarChart3, title: 'Trading', description: 'Crypto markets & exchanges' },
]

export default function BlockchainCryptoPage() {
  return (
    <main className="min-h-screen py-24">
      {/* Hero Section */}
      <section className="container mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-orange/10 text-cyber-orange text-sm font-medium mb-6">
            <Bitcoin className="w-4 h-4" />
            Pillar of the Future
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Blockchain &
            <span className="bg-gradient-to-r from-cyber-orange to-yellow-500 bg-clip-text text-transparent"> Crypto</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore the decentralized revolution. Real-time cryptocurrency prices, blockchain news,
            and insights into the future of digital finance.
          </p>

          {/* Tool Badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              { icon: ArrowRightLeft, label: 'Unit Converter' },
              { icon: Calculator, label: 'ROI Calculator' },
              { icon: Wallet, label: 'Address Validator' },
              { icon: Coins, label: 'Gas Estimator' },
            ].map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm"
              >
                <badge.icon className="w-4 h-4 text-cyber-orange" />
                <span className="font-medium">{badge.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Live Price Ticker */}
      <section className="container mb-12">
        <CryptoPriceTicker />
      </section>

      {/* Bitcoin Widget + News Side by Side */}
      <section className="container mb-16">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyber-orange/10 flex items-center justify-center">
                <Bitcoin className="w-5 h-5 text-cyber-orange" />
              </div>
              Bitcoin Live
            </h2>
            <BitcoinWidget showSparkline={true} />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              Crypto News
            </h2>
            <NewsFeed
              endpoint="/api/news/crypto"
              title="Latest Crypto News"
              icon={<Coins className="w-5 h-5 text-cyber-orange" />}
              limit={6}
            />
          </div>
        </div>
      </section>

      {/* Cryptocurrency Prices Grid */}
      <section className="container mb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-trading-profit/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-trading-profit" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Top Cryptocurrencies</h2>
              <p className="text-sm text-muted-foreground">Live market data from CoinGecko</p>
            </div>
          </div>
        </div>
        <CryptoPriceGrid />
      </section>

      {/* Crypto Tools Section */}
      <section className="container mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-cyber-orange/10 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-cyber-orange" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Crypto Tools</h2>
              <p className="text-sm text-muted-foreground">Free utilities for crypto investors</p>
            </div>
          </div>
        </motion.div>

        <CryptoToolsGrid />
      </section>

      {/* Features Section */}
      <section className="container mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Why Blockchain Matters</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Understanding the core principles that make blockchain technology revolutionary.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-card border border-border rounded-xl hover:border-cyber-orange/30 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-cyber-orange/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-cyber-orange" />
              </div>
              <h3 className="font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Blockchain Platforms */}
      <section className="container mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Popular Blockchain Platforms</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each blockchain has unique features and use cases.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blockchainPlatforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 bg-card border border-border rounded-xl hover:border-primary/30 transition-all"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center mb-4 text-white text-2xl font-bold`}
              >
                {platform.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{platform.name}</h3>
              <p className="text-sm text-muted-foreground">{platform.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="container mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Blockchain Use Cases</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From DeFi to NFTs, blockchain technology is transforming industries.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-card border border-border rounded-xl text-center hover:border-primary/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                <useCase.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h4 className="font-semibold text-sm mb-1">{useCase.title}</h4>
              <p className="text-xs text-muted-foreground">{useCase.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-cyber-orange/10 via-yellow-500/5 to-transparent border border-cyber-orange/20 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Explore Web3?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Check out my blockchain projects and decentralized applications built on various chains.
          </p>
          <Link
            href="/projects?category=blockchain"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyber-orange text-white rounded-lg font-medium hover:bg-cyber-orange/90 transition-colors"
          >
            View Blockchain Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </main>
  )
}
