# 🧠 Deep Understanding

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**A comprehensive learning path to master Large Language Models from fundamentals to cutting-edge research.**

</div>

---

## 📋 Overview

Deep Understanding is an interactive web application that guides you through mastering LLMs with a structured curriculum:

- ✅ **87 curated resources** - Papers, videos, tutorials, and tools
- 📊 **Progress tracking** - 5 mastery levels with cloud sync
- 🔐 **User accounts** - Secure authentication with Supabase
- 📍 **Learning path** - Sequential, focused learning experience
- 🎉 **Gamification** - Achievements and celebrations

**Prerequisites:** Python, Linear Algebra, Calculus, Probability & Statistics

---

## 🗺️ Roadmap

### 📘 Chapter 1: Deep Learning Fundamentals

| Topic | Resource | Type |
|-------|----------|------|
| Neural Networks Intro | [3Blue1Brown: Neural Networks](https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi) | 🎥 Video |
| Backpropagation | [Andrej Karpathy: micrograd](https://www.youtube.com/watch?v=VMj-3S1tku0) | 🎥 Video |
| Building GPT | [Andrej Karpathy: Let's build GPT](https://www.youtube.com/watch?v=kCc8FmEb1nY) | 🎥 Video |
| Tokenization | [Andrej Karpathy: Tokenization](https://www.youtube.com/watch?v=zduSFxRajkE) | 🎥 Video |
| LLM from Scratch | [Sebastian Raschka: Build LLM](https://www.youtube.com/watch?v=kPGTx4wcm_w) | 🎥 Video |
| Deep Learning Theory | [Deep Learning Book](https://www.deeplearningbook.org/) | 📖 Book |

---

### 🏗️ Chapter 2: Transformer Architecture

#### 2.1 Attention Mechanisms
| Topic | Resource | Type |
|-------|----------|------|
| Original Transformer | [Attention Is All You Need](https://arxiv.org/abs/1706.03762) | 📄 Paper |
| Visual Guide | [Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) | 📝 Blog |
| Code Implementation | [Annotated Transformer](https://nlp.seas.harvard.edu/annotated-transformer/) | 📝 Blog |
| Grouped Query Attention | [GQA Paper](https://arxiv.org/abs/2305.13245) | 📄 Paper |
| Multi-Latent Attention | [DeepSeek-V2](https://arxiv.org/abs/2405.04434) | 📄 Paper |
| Flash Attention | [FlashAttention](https://arxiv.org/abs/2205.14135) | 📄 Paper |
| Flash Attention 2 | [FlashAttention-2](https://arxiv.org/abs/2307.08691) | 📄 Paper |

#### 2.2 Feed-Forward & Components
| Topic | Resource | Type |
|-------|----------|------|
| SwiGLU | [GLU Variants](https://arxiv.org/abs/2002.05202) | 📄 Paper |
| Mixture of Experts | [Switch Transformers](https://arxiv.org/abs/2101.03961) | 📄 Paper |
| DeepSeekMoE | [DeepSeekMoE](https://arxiv.org/abs/2401.06066) | 📄 Paper |
| RMSNorm | [RMSNorm](https://arxiv.org/abs/1910.07467) | 📄 Paper |
| RoPE | [RoFormer](https://arxiv.org/abs/2104.09864) | 📄 Paper |

---

### ⚡ Chapter 3: Modern Model Architectures

| Model | Resource | Type |
|-------|----------|------|
| GPT-3 | [Few-Shot Learners](https://arxiv.org/abs/2005.14165) | 📄 Paper |
| GPT-4 | [Technical Report](https://arxiv.org/abs/2303.08774) | 📄 Paper |
| LLaMA | [LLaMA Paper](https://arxiv.org/abs/2302.13971) | 📄 Paper |
| LLaMA 2 | [LLaMA 2 Paper](https://arxiv.org/abs/2307.09288) | 📄 Paper |
| LLaMA 3 | [Meta Blog](https://ai.meta.com/blog/meta-llama-3/) | 📝 Blog |
| Mistral 7B | [Mistral](https://arxiv.org/abs/2310.06825) | 📄 Paper |
| Mixtral 8x7B | [Mixtral](https://arxiv.org/abs/2401.04088) | 📄 Paper |
| DeepSeek-V2 | [DeepSeek-V2](https://arxiv.org/abs/2405.04434) | 📄 Paper |
| DeepSeek-V3 | [DeepSeek-V3](https://arxiv.org/abs/2412.19437) | 📄 Paper |
| Qwen 2.5 | [Qwen2.5](https://arxiv.org/abs/2412.15115) | 📄 Paper |
| OLMo | [OLMo](https://arxiv.org/abs/2402.00838) | 📄 Paper |
| Gemma | [Gemma](https://arxiv.org/abs/2403.08295) | 📄 Paper |
| Phi-3 | [Phi-3](https://arxiv.org/abs/2404.14219) | 📄 Paper |

---

### 🎯 Chapter 4: Pre-training

| Topic | Resource | Type |
|-------|----------|------|
| Scaling Laws | [Scaling Laws](https://arxiv.org/abs/2001.08361) | 📄 Paper |
| Chinchilla | [Compute-Optimal Training](https://arxiv.org/abs/2203.15556) | 📄 Paper |
| The Pile | [The Pile Dataset](https://arxiv.org/abs/2101.00027) | 📄 Paper |
| Megatron-LM | [Megatron-LM](https://arxiv.org/abs/1909.08053) | 📄 Paper |
| FSDP | [PyTorch FSDP](https://pytorch.org/tutorials/intermediate/FSDP_tutorial.html) | 📚 Tutorial |
| DeepSpeed | [ZeRO](https://arxiv.org/abs/1910.02054) | 📄 Paper |

---

### 🔧 Chapter 5: Fine-tuning & Alignment

#### 5.1 SFT & PEFT
| Topic | Resource | Type |
|-------|----------|------|
| FLAN | [Instruction Tuning](https://arxiv.org/abs/2109.01652) | 📄 Paper |
| LoRA | [LoRA](https://arxiv.org/abs/2106.09685) | 📄 Paper |
| QLoRA | [QLoRA](https://arxiv.org/abs/2305.14314) | 📄 Paper |

#### 5.2 RLHF
| Topic | Resource | Type |
|-------|----------|------|
| InstructGPT | [InstructGPT](https://arxiv.org/abs/2203.02155) | 📄 Paper |
| PPO | [PPO Algorithm](https://arxiv.org/abs/1707.06347) | 📄 Paper |
| Constitutional AI | [CAI](https://arxiv.org/abs/2212.08073) | 📄 Paper |

#### 5.3 DPO & RLVR
| Topic | Resource | Type |
|-------|----------|------|
| DPO | [DPO](https://arxiv.org/abs/2305.18290) | 📄 Paper |
| ORPO | [ORPO](https://arxiv.org/abs/2403.07691) | 📄 Paper |
| GRPO | [DeepSeekMath](https://arxiv.org/abs/2402.03300) | 📄 Paper |
| Process Rewards | [Let's Verify](https://arxiv.org/abs/2305.20050) | 📄 Paper |

---

### 🚀 Chapter 6: Inference & Optimization

| Topic | Resource | Type |
|-------|----------|------|
| KV Cache | [Efficient Transformers](https://arxiv.org/abs/2009.06732) | 📄 Paper |
| Speculative Decoding | [Spec Decoding](https://arxiv.org/abs/2211.17192) | 📄 Paper |
| vLLM | [PagedAttention](https://arxiv.org/abs/2309.06180) | 📄 Paper |
| SGLang | [SGLang](https://arxiv.org/abs/2312.07104) | 📄 Paper |
| GPTQ | [GPTQ](https://arxiv.org/abs/2210.17323) | 📄 Paper |
| AWQ | [AWQ](https://arxiv.org/abs/2306.00978) | 📄 Paper |
| TensorRT-LLM | [GitHub](https://github.com/NVIDIA/TensorRT-LLM) | 🛠️ Tool |
| Triton | [triton-lang.org](https://triton-lang.org/) | 🛠️ Tool |

---

### 🧠 Chapter 7: Reasoning & Agents

| Topic | Resource | Type |
|-------|----------|------|
| Chain-of-Thought | [CoT](https://arxiv.org/abs/2201.11903) | 📄 Paper |
| Self-Consistency | [Self-Consistency](https://arxiv.org/abs/2203.11171) | 📄 Paper |
| Tree of Thoughts | [ToT](https://arxiv.org/abs/2305.10601) | 📄 Paper |
| ReAct | [ReAct](https://arxiv.org/abs/2210.03629) | 📄 Paper |
| Toolformer | [Toolformer](https://arxiv.org/abs/2302.04761) | 📄 Paper |
| OpenAI o1 | [Learning to Reason](https://openai.com/index/learning-to-reason-with-llms/) | 📝 Blog |
| DeepSeek-R1 | [DeepSeek-R1](https://arxiv.org/abs/2501.12948) | 📄 Paper |

---

### 📊 Chapter 8: Evaluation & Benchmarks

| Topic | Resource | Type |
|-------|----------|------|
| MMLU | [MMLU](https://arxiv.org/abs/2009.03300) | 📄 Paper |
| GSM8K | [GSM8K](https://arxiv.org/abs/2110.14168) | 📄 Paper |
| MATH | [MATH](https://arxiv.org/abs/2103.03874) | 📄 Paper |
| HumanEval | [HumanEval](https://arxiv.org/abs/2107.03374) | 📄 Paper |
| GPQA | [GPQA](https://arxiv.org/abs/2311.12022) | 📄 Paper |
| ARC-AGI | [ARC](https://arxiv.org/abs/1911.01547) | 📄 Paper |
| Chatbot Arena | [LMSYS](https://chat.lmsys.org/) | 🛠️ Tool |

---

### 🌐 Chapter 9: Multimodality

| Topic | Resource | Type |
|-------|----------|------|
| ViT | [Vision Transformer](https://arxiv.org/abs/2010.11929) | 📄 Paper |
| CLIP | [CLIP](https://arxiv.org/abs/2103.00020) | 📄 Paper |
| LLaVA | [LLaVA](https://arxiv.org/abs/2304.08485) | 📄 Paper |
| GPT-4V | [System Card](https://openai.com/research/gpt-4v-system-card) | 📝 Blog |
| Whisper | [Whisper](https://arxiv.org/abs/2212.04356) | 📄 Paper |
| Stable Diffusion | [Latent Diffusion](https://arxiv.org/abs/2112.10752) | 📄 Paper |

---

### 🛠️ Chapter 10: Tools & Frameworks

| Tool | Resource | Type |
|------|----------|------|
| PyTorch | [Tutorials](https://pytorch.org/tutorials/) | 📚 Tutorial |
| HuggingFace | [Transformers](https://huggingface.co/docs/transformers) | 📚 Docs |
| LangChain | [Docs](https://docs.langchain.com/) | 📚 Docs |
| LlamaIndex | [Docs](https://docs.llamaindex.ai/) | 📚 Docs |
| W&B | [Docs](https://docs.wandb.ai/) | 📚 Docs |
| Ollama | [GitHub](https://github.com/ollama/ollama) | 🛠️ Tool |
| llama.cpp | [GitHub](https://github.com/ggerganov/llama.cpp) | 🛠️ Tool |

---

### 📰 Chapter 11: Staying Updated

| Resource | Link | Type |
|----------|------|------|
| Papers With Code | [paperswithcode.com](https://paperswithcode.com/) | 🌐 Web |
| ArXiv Sanity | [arxiv-sanity-lite](https://arxiv-sanity-lite.com/) | 🌐 Web |
| Sebastian Raschka | [Newsletter](https://magazine.sebastianraschka.com/) | 📰 Newsletter |
| The Batch | [deeplearning.ai](https://www.deeplearning.ai/the-batch/) | 📰 Newsletter |
| AI Explained | [YouTube](https://www.youtube.com/@aiexplained-official) | 🎥 Video |

---

## 📖 How to Use

Open `index.html` in your browser:

1. **Browse chapters** - Navigate the curriculum
2. **Mark progress** - Click resources to cycle mastery levels:
   - ⚪ Not started → 🟡 In progress → 🟢 Basic → 🔵 Intermediate → ⭐ Mastered
3. **Track stats** - View progress dashboard
4. **Data persists** - Saved in LocalStorage

### ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `H` | Go to Dashboard (Home) |
| `1-9`, `0` | Navigate to Chapter 1-10 |
| `Esc` | Close modal/sidebar |
| `?` | Show shortcuts help |

### 🎉 Features

- **Confetti celebration** - Complete a chapter to see confetti! 
- **Achievement badges** - Get notified when mastering topics
- **Animated UI** - Smooth transitions and micro-animations
- **Color-coded types** - Papers, videos, tutorials have distinct colors
- **Pulse effects** - In-progress items gently pulse
- **Star sparkle** - Mastered items have a subtle glow

### 💾 Export & Import Progress

Use the browser console:

```javascript
// Export your progress to a JSON file
exportProgress()

// Import progress from a file
importProgress(file)

// Reset all progress (with confirmation)
resetProgress()
```

---

## 🤝 Contributing

Contributions welcome! You can:

- **Add resources** - Found a great paper or tutorial? Submit a PR!
- **Fix links** - Report broken or outdated resources
- **Improve content** - Suggest better descriptions or organization
- **Translate** - Help translate to other languages

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

<div align="center">

**Made with ❤️ for the AI community**

⭐ Star this repo if you find it useful!

</div>

