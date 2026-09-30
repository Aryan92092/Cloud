import React from 'react';
import { BookOpen, Cpu, CheckCircle2, Zap } from 'lucide-react';

export default function AboutDAAPage() {
  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Design &amp; Analysis of Algorithms (DAA) Concepts</h1>
        <p className="text-xs text-slate-500 mt-1">Comprehensive technical syllabus documentation and algorithmic breakdown.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-teal-600 font-bold text-sm uppercase tracking-wider">
          <Zap className="w-4 h-4" /> 1. Problem Statement &amp; Motivation
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          Sorting and searching large volumes of academic examination records manually or with naive quadratic algorithms leads to computational bottlenecks (O(n&sup2;)).
          This project implements and compares 6 pure sorting algorithms and 2 searching algorithms to achieve fair, mathematically rigorous ranking and sub-millisecond retrieval.
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-teal-600 font-bold text-sm uppercase tracking-wider">
          <Cpu className="w-4 h-4" /> 2. Implemented Algorithmic Paradigms
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">Divide &amp; Conquer (Merge &amp; Quick Sort)</h4>
            <p className="text-slate-600">Divides the student cohort into subproblems, solves recursively, and merges results in O(n log n) time.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">Heap Data Structure (Heap Sort)</h4>
            <p className="text-slate-600">Constructs a binary heap representation with zero auxiliary memory allocation O(1 space).</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">Incremental &amp; Exchange (Insertion &amp; Bubble)</h4>
            <p className="text-slate-600">Demonstrates best-case O(n) optimization when processing nearly-sorted student batches.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">Logarithmic Search (Binary Search)</h4>
            <p className="text-slate-600">Eliminates half of the remaining search space per step, locating any student in &le; &lceil;log&sub2;(n)&rceil; comparisons.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
