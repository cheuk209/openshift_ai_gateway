import React from 'react';

const AITaxonomyDiagram = () => {
  return (
    <div className="bg-gray-950 p-6 min-h-screen font-sans">
      <h1 className="text-2xl font-bold text-white text-center mb-2">AI Taxonomy: How Everything Fits Together</h1>
      <p className="text-gray-400 text-center mb-6 text-sm">Nested boxes show containment: inner concepts are subsets of outer concepts</p>
      
      <svg viewBox="0 0 1000 750" className="w-full max-w-5xl mx-auto">
        {/* AI - Outermost layer */}
        <rect x="10" y="10" width="980" height="730" rx="16" fill="#0f172a" stroke="#3b82f6" strokeWidth="4"/>
        <text x="30" y="45" fill="#60a5fa" fontSize="24" fontWeight="bold">ARTIFICIAL INTELLIGENCE (AI)</text>
        <text x="30" y="70" fill="#64748b" fontSize="13">Any system that exhibits intelligent behavior</text>
        
        {/* Machine Learning layer */}
        <rect x="25" y="130" width="950" height="595" rx="14" fill="#052e16" stroke="#22c55e" strokeWidth="3"/>
        <text x="45" y="165" fill="#4ade80" fontSize="20" fontWeight="bold">MACHINE LEARNING (ML)</text>
        <text x="45" y="188" fill="#64748b" fontSize="12">Systems that learn patterns from data</text>
        
        {/* Three paradigms side by side */}
        <text x="45" y="220" fill="#86efac" fontSize="14" fontWeight="bold">THE THREE LEARNING PARADIGMS:</text>
        
        {/* Supervised */}
        <rect x="45" y="235" width="295" height="220" rx="10" fill="#312e81" stroke="#818cf8" strokeWidth="2"/>
        <text x="65" y="265" fill="#a5b4fc" fontSize="16" fontWeight="bold">SUPERVISED LEARNING</text>
        <text x="65" y="285" fill="#c7d2fe" fontSize="11">Learn from labeled examples</text>
        
        {/* Unsupervised */}
        <rect x="355" y="235" width="295" height="220" rx="10" fill="#7c2d12" stroke="#fb923c" strokeWidth="2"/>
        <text x="375" y="265" fill="#fdba74" fontSize="16" fontWeight="bold">UNSUPERVISED LEARNING</text>
        <text x="375" y="285" fill="#fed7aa" fontSize="11">Find hidden patterns</text>
        
        {/* Reinforcement */}
        <rect x="665" y="235" width="295" height="220" rx="10" fill="#164e63" stroke="#22d3ee" strokeWidth="2"/>
        <text x="685" y="265" fill="#67e8f9" fontSize="16" fontWeight="bold">REINFORCEMENT LEARNING</text>
        <text x="685" y="285" fill="#a5f3fc" fontSize="11">Learn through trial and reward</text>
        
        {/* Deep Learning spans across bottom */}
        <rect x="45" y="470" width="915" height="240" rx="12" fill="#581c87" stroke="#d946ef" strokeWidth="3"/>
        <text x="65" y="505" fill="#e879f9" fontSize="18" fontWeight="bold">DEEP LEARNING</text>
        <text x="220" y="505" fill="#c084fc" fontSize="12">(A TECHNIQUE that applies to any paradigm)</text>
        
        {/* Architecture boxes inside Deep Learning */}
        <rect x="60" y="540" width="200" height="155" rx="8" fill="#3b0764" stroke="#a855f7"/>
        <text x="80" y="565" fill="#d8b4fe" fontSize="12" fontWeight="bold">CNNs</text>
        
        <rect x="275" y="540" width="200" height="155" rx="8" fill="#3b0764" stroke="#a855f7"/>
        <text x="295" y="565" fill="#d8b4fe" fontSize="12" fontWeight="bold">RNNs / LSTMs</text>
        
        <rect x="490" y="540" width="230" height="155" rx="8" fill="#14532d" stroke="#4ade80" strokeWidth="2"/>
        <text x="510" y="565" fill="#4ade80" fontSize="12" fontWeight="bold">TRANSFORMERS / LLMs</text>
        
        <rect x="735" y="540" width="210" height="155" rx="8" fill="#3b0764" stroke="#a855f7"/>
        <text x="755" y="565" fill="#d8b4fe" fontSize="12" fontWeight="bold">GENERATIVE MODELS</text>
      </svg>
    </div>
  );
};

export default AITaxonomyDiagram;
