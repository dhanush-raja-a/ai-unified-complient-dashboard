/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layers, ChevronRight, MessageSquare, Target, Zap } from 'lucide-react';
import { DedupCluster as DedupClusterType } from '../types';
import { cn } from '../lib/utils';

interface DedupClusterProps {
  clusters: DedupClusterType[];
}

export default function DedupCluster({ clusters }: DedupClusterProps) {
  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-zinc-950">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Dedup Cluster</h1>
          <p className="text-sm text-zinc-500">AI-driven identification of duplicate and related complaints.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Total Clusters</p>
              <h3 className="text-xl font-bold text-zinc-100">{clusters.length}</h3>
            </div>
          </div>
          <button className="px-4 py-2 bg-emerald-500 text-zinc-950 rounded-lg font-bold text-sm hover:bg-emerald-400 transition-colors flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Run AI Dedup
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {clusters.map(cluster => (
          <div key={cluster.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="p-6 flex items-start justify-between border-b border-zinc-800">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-zinc-100">{cluster.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full font-bold uppercase tracking-wider">
                    {cluster.id}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 max-w-2xl">{cluster.summary}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Similarity</p>
                  <p className="text-xl font-bold text-emerald-500">{(cluster.similarityScore * 100).toFixed(0)}%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Complaints</p>
                  <p className="text-xl font-bold text-zinc-100">{cluster.complaintCount}</p>
                </div>
                <button className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="bg-zinc-950/50 p-4 flex items-center gap-4">
              <div className="flex -space-x-2">
                {cluster.complaintIds.slice(0, 3).map(id => (
                  <div key={id} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[8px] font-bold text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all cursor-default" title={id}>
                    {id.split('-')[1]}
                  </div>
                ))}
                {cluster.complaintCount > 3 && (
                  <div className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-emerald-500">
                    +{cluster.complaintCount - 3}
                  </div>
                )}
              </div>
              <span className="text-xs text-zinc-500 font-medium">Related complaints identified by AI</span>
              <div className="ml-auto flex items-center gap-2">
                <button className="text-xs font-bold text-emerald-500 hover:underline">Merge All</button>
                <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                <button className="text-xs font-bold text-zinc-400 hover:text-white">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
