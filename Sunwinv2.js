const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Class UltraDicePredictionSystem - Nâng cấp
class UltraDicePredictionSystem {
    constructor() {
        this.history = [];
        this.patternDatabase = new Map(); // Lưu patterns với tần suất
        this.patternRelations = new Map(); // Quan hệ giữa các patterns
        this.models = {};
        this.weights = {};
        this.performance = {};
        this.advancedPatterns = {};
        this.marketMemory = []; // Bộ nhớ thị trường
        this.learningRate = 0.01;
        this.maxHistorySize = 5000; // Lưu 5000 lịch sử
        
        // Thống kê nâng cao
        this.sessionStats = {
            streaks: { T: 0, X: 0, maxT: 0, maxX: 0 },
            transitions: {},
            volatility: 0.5,
            entropy: 0,
            bias: { T: 0, X: 0 },
            patternRecognition: {
                totalPatterns: 0,
                activePatterns: 0,
                patternAccuracy: 0
            },
            modelPerformance: {},
            marketRegimes: [],
            predictions: {
                total: 0,
                correct: 0,
                accuracy: 0
            }
        };
        
        // Trạng thái thị trường nâng cao
        this.marketState = {
            trend: 'neutral',
            momentum: 0,
            stability: 0.5,
            regime: 'normal',
            cycle: 'unknown',
            patternEfficiency: 0,
            predictionConfidence: 0,
            riskLevel: 'medium'
        };
        
        // Tham số thích ứng
        this.adaptiveParams = {
            patternMinLength: 2,
            patternMaxLength: 15,
            volatilityThreshold: 0.7,
            trendStrengthThreshold: 0.6,
            confidenceDecay: 0.98,
            learningRate: 0.01,
            patternWeight: 1.0,
            trendWeight: 1.0,
            momentumWeight: 1.0
        };
        
        this.initAllModels();
        this.startLearningCycle();
    }

    initAllModels() {
        // Khởi tạo 21 models chính + 21 models mini + 42 models hỗ trợ
        for (let i = 1; i <= 21; i++) {
            // Models chính
            this.models[`model${i}`] = this[`model${i}`].bind(this);
            // Models mini
            this.models[`model${i}Mini`] = this[`model${i}Mini`].bind(this);
            // Models hỗ trợ (mỗi model chính có 2 models hỗ trợ)
            this.models[`model${i}Support1`] = this[`model${i}Support1`].bind(this);
            this.models[`model${i}Support2`] = this[`model${i}Support2`].bind(this);
            
            // Khởi tạo weights và performance
            this.weights[`model${i}`] = 1.0;
            this.weights[`model${i}Mini`] = 0.8;
            this.weights[`model${i}Support1`] = 0.6;
            this.weights[`model${i}Support2`] = 0.6;
            
            this.performance[`model${i}`] = {
                correct: 0, total: 0, accuracy: 0,
                recentCorrect: 0, recentTotal: 0, recentAccuracy: 0,
                streak: 0, maxStreak: 0, consistency: 0,
                lastPredictions: []
            };
            
            this.performance[`model${i}Mini`] = { ...this.performance[`model${i}`] };
            this.performance[`model${i}Support1`] = { ...this.performance[`model${i}`] };
            this.performance[`model${i}Support2`] = { ...this.performance[`model${i}`] };
        }
        
        this.initPatternLearning();
        this.initAdvancedAlgorithms();
    }

    initPatternLearning() {
        // Khởi tạo hệ thống học pattern
        this.patternLearning = {
            patterns: new Map(),
            frequencies: new Map(),
            predictions: new Map(),
            accuracies: new Map(),
            lastUpdate: Date.now()
        };
    }

    initAdvancedAlgorithms() {
        // Thuật toán phát hiện pattern nâng cao
        this.advancedAlgorithms = {
            fibonacci: this.fibonacciPattern.bind(this),
            harmonic: this.harmonicPattern.bind(this),
            geometric: this.geometricPattern.bind(this),
            wavelet: this.waveletAnalysis.bind(this),
            markov: this.markovChain.bind(this),
            bayesian: this.bayesianInference.bind(this),
            neural: this.neuralNetwork.bind(this),
            genetic: this.geneticAlgorithm.bind(this),
            fuzzy: this.fuzzyLogic.bind(this),
            ensemble: this.ensembleLearning.bind(this)
        };
    }

    startLearningCycle() {
        // Chu kỳ học tập tự động
        setInterval(() => {
            this.learnFromHistory();
            this.optimizeWeights();
            this.updatePatternDatabase();
            this.adaptToMarket();
        }, 60000); // Học mỗi phút
    }

    // ==================== MODEL 1: NHẬN BIẾT CÁC LOẠI CẦU CƠ BẢN ====================
    model1() {
        const patterns = this.detectBasicPatterns();
        if (patterns.length === 0) return null;
        
        const bestPattern = this.selectBestPattern(patterns);
        const confidence = this.calculatePatternConfidence(bestPattern);
        
        return {
            prediction: bestPattern.prediction,
            confidence: confidence,
            reason: `Phát hiện pattern ${bestPattern.name} (độ tin cậy ${(confidence*100).toFixed(1)}%) - ${bestPattern.description}`
        };
    }

    model1Mini(data) {
        return this.detectBasicPatterns(data || this.history.slice(-20));
    }

    model1Support1() {
        return {
            patternAnalysis: this.analyzePatternEfficiency(),
            patternDistribution: this.getPatternDistribution(),
            recommendation: this.suggestPatternStrategy()
        };
    }

    model1Support2() {
        return {
            patternCorrelations: this.calculatePatternCorrelations(),
            optimalPatterns: this.findOptimalPatterns(),
            patternForecast: this.forecastPatternEvolution()
        };
    }

    detectBasicPatterns(data = this.history) {
        const patterns = [];
        const basicPatterns = {
            '1-1': { pattern: ['T','X','T','X'], description: 'Cầu đan xen 1-1' },
            '1-2-1': { pattern: ['T','X','X','T'], description: 'Cầu 1-2-1' },
            '2-1-2': { pattern: ['T','T','X','T','T'], description: 'Cầu 2-1-2' },
            '3-1': { pattern: ['T','T','T','X'], description: 'Cầu 3-1' },
            '1-3': { pattern: ['T','X','X','X'], description: 'Cầu 1-3' },
            '2-2': { pattern: ['T','T','X','X'], description: 'Cầu 2-2' },
            '3-2': { pattern: ['T','T','T','X','X'], description: 'Cầu 3-2' },
            '2-3': { pattern: ['T','T','X','X','X'], description: 'Cầu 2-3' },
            '4-1': { pattern: ['T','T','T','T','X'], description: 'Cầu 4-1' },
            '1-4': { pattern: ['T','X','X','X','X'], description: 'Cầu 1-4' }
        };

        for (const [name, info] of Object.entries(basicPatterns)) {
            const pattern = info.pattern;
            if (data.length >= pattern.length) {
                const lastSegment = data.slice(-pattern.length + 1);
                const patternWithoutLast = pattern.slice(0, -1);
                
                if (this.arraysEqual(lastSegment, patternWithoutLast)) {
                    patterns.push({
                        name: name,
                        pattern: pattern,
                        prediction: pattern[pattern.length - 1],
                        description: info.description,
                        strength: this.calculatePatternStrength(pattern, data),
                        frequency: this.getPatternFrequency(name)
                    });
                }
            }
        }
        
        return patterns;
    }

    // ==================== MODEL 2: BẮT TREND XU HƯỚNG NGẮN VÀ DÀI ====================
    model2() {
        const shortTerm = this.analyzeTrend(10);
        const mediumTerm = this.analyzeTrend(30);
        const longTerm = this.analyzeTrend(100);
        
        const trendAnalysis = this.synthesizeTrends(shortTerm, mediumTerm, longTerm);
        
        return {
            prediction: trendAnalysis.prediction,
            confidence: trendAnalysis.confidence,
            reason: `Xu hướng: Ngắn hạn ${shortTerm.direction} (${(shortTerm.strength*100).toFixed(1)}%), Trung hạn ${mediumTerm.direction} (${(mediumTerm.strength*100).toFixed(1)}%), Dài hạn ${longTerm.direction} (${(longTerm.strength*100).toFixed(1)}%)`
        };
    }

    model2Mini(data) {
        return this.analyzeTrend(data.length, data);
    }

    model2Support1() {
        return {
            trendQuality: this.assessTrendQuality(),
            reversalPoints: this.identifyReversalZones(),
            momentumIndicators: this.calculateMomentumIndicators()
        };
    }

    model2Support2() {
        return {
            trendCycles: this.identifyTrendCycles(),
            strengthProjection: this.projectTrendStrength(),
            entryPoints: this.findOptimalEntryPoints()
        };
    }

    analyzeTrend(period, data = this.history) {
        if (data.length < period) return { direction: 'unknown', strength: 0 };
        
        const segment = data.slice(-period);
        const tCount = segment.filter(x => x === 'T').length;
        const xCount = segment.filter(x => x === 'X').length;
        
        let direction = tCount > xCount ? 'T' : (xCount > tCount ? 'X' : 'neutral');
        let rawStrength = Math.abs(tCount - xCount) / period;
        
        // Tính toán độ ổn định của trend
        let consistency = 0;
        let changes = 0;
        for (let i = 1; i < segment.length; i++) {
            if (segment[i] !== segment[i-1]) changes++;
            if (i >= 5) {
                const subSegment = segment.slice(i-5, i);
                const subT = subSegment.filter(x => x === 'T').length;
                const subDirection = subT > 2.5 ? 'T' : 'X';
                if (subDirection === direction) consistency++;
            }
        }
        
        const stability = consistency / Math.max(1, segment.length - 5);
        const volatility = changes / (segment.length - 1);
        const strength = rawStrength * (1 - volatility/2) * (0.5 + stability/2);
        
        return {
            direction,
            strength,
            rawStrength,
            volatility,
            stability,
            tCount,
            xCount
        };
    }

    // ==================== MODEL 3: CHÊNH LỆCH CAO TRONG 12 PHIÊN ====================
    model3() {
        const analysis = this.analyzeImbalance(12);
        
        if (analysis.imbalance < 0.4) return null;
        
        const confidence = this.calculateImbalanceConfidence(analysis);
        
        return {
            prediction: analysis.prediction,
            confidence: confidence,
            reason: `Chênh lệch ${analysis.imbalance.toFixed(1)}% trong 12 phiên (T:${analysis.tCount}, X:${analysis.xCount}) - Dự đoán cân bằng`
        };
    }

    model3Mini(data) {
        return this.analyzeImbalance(data.length, data);
    }

    model3Support1() {
        return {
            imbalanceHistory: this.trackImbalanceHistory(),
            optimalThreshold: this.findOptimalImbalanceThreshold(),
            meanReversionStrength: this.calculateMeanReversionStrength()
        };
    }

    model3Support2() {
        return {
            regressionAnalysis: this.performRegressionAnalysis(),
            confidenceZones: this.identifyConfidenceZones(),
            adaptiveThresholds: this.calculateAdaptiveThresholds()
        };
    }

    analyzeImbalance(period, data = this.history) {
        if (data.length < period) return { imbalance: 0 };
        
        const segment = data.slice(-period);
        const tCount = segment.filter(x => x === 'T').length;
        const xCount = segment.filter(x => x === 'X').length;
        const total = segment.length;
        
        const imbalance = Math.abs(tCount - xCount) / total;
        const prediction = tCount > xCount ? 'X' : 'T';
        
        return {
            imbalance,
            prediction,
            tCount,
            xCount,
            total,
            ratio: Math.max(tCount, xCount) / Math.min(tCount, xCount)
        };
    }

    // ==================== MODEL 4: BẮT CẦU NGẮN HẠN ====================
    model4() {
        const analysis = this.analyzeShortTermPattern(6);
        
        if (analysis.confidence < 0.6) return null;
        
        return {
            prediction: analysis.prediction,
            confidence: analysis.confidence,
            reason: `Cầu ngắn hạn: ${analysis.description} (độ tin cậy ${(analysis.confidence*100).toFixed(1)}%)`
        };
    }

    model4Mini(data) {
        return this.analyzeShortTermPattern(data.length, data);
    }

    model4Support1() {
        return {
            momentumScore: this.calculateMomentumScore(),
            reversalSignals: this.detectReversalSignals(),
            patternContinuity: this.assessPatternContinuity()
        };
    }

    model4Support2() {
        return {
            microPatterns: this.detectMicroPatterns(),
            entryTiming: this.optimizeEntryTiming(),
            riskAssessment: this.assessShortTermRisk()
        };
    }

    analyzeShortTermPattern(period, data = this.history) {
        if (data.length < period) return { confidence: 0 };
        
        const segment = data.slice(-period);
        const last3 = segment.slice(-3);
        
        let prediction, confidence, description;
        
        // Phân tích patterns ngắn hạn
        if (this.allEqual(last3, 'T')) {
            prediction = 'T';
            confidence = 0.75;
            description = '3 T liên tiếp';
        } else if (this.allEqual(last3, 'X')) {
            prediction = 'X';
            confidence = 0.75;
            description = '3 X liên tiếp';
        } else if (last3[0] === last3[1] && last3[1] !== last3[2]) {
            prediction = last3[1];
            confidence = 0.7;
            description = '2 giống nhau + 1 khác';
        } else if (last3[0] !== last3[1] && last3[1] === last3[2]) {
            prediction = last3[1] === 'T' ? 'X' : 'T';
            confidence = 0.65;
            description = 'Pattern đảo chiều';
        } else {
            const momentum = this.calculateMomentum(segment);
            prediction = momentum > 0 ? 'T' : 'X';
            confidence = Math.abs(momentum) * 0.6;
            description = 'Theo momentum';
        }
        
        return { prediction, confidence, description };
    }

    // ==================== MODEL 5: CÂN BẰNG TRỌNG SỐ DỰ ĐOÁN ====================
    model5() {
        const predictions = this.getAllPredictions();
        const balance = this.analyzePredictionBalance(predictions);
        
        if (balance.imbalance > 0.6) {
            const adjusted = this.adjustPredictions(predictions, balance);
            
            return {
                prediction: adjusted.prediction,
                confidence: adjusted.confidence,
                reason: `Cân bằng tỷ lệ dự đoán (T:${balance.tCount}, X:${balance.xCount}) - Điều chỉnh theo xu hướng thị trường`
            };
        }
        
        return null;
    }

    model5Mini(predictions) {
        return this.analyzePredictionBalance(predictions);
    }

    model5Support1() {
        return {
            weightDistribution: this.getWeightDistribution(),
            balanceHistory: this.trackBalanceHistory(),
            optimizationSuggestions: this.suggestWeightOptimization()
        };
    }// <--- Tìm dấu này ở khoảng dòng 460

    // ==================== HÀM TỰ ĐỘNG LẤY DỮ LIỆU GAME ====================
    async autoFetchGame() {
        try {
            // THAY LINK API THẬT CỦA GAME VÀO ĐÂY
            const response = await axios.get('https://wtxmd52.tele68.com/v1/txmd5/sessions'); 
            
            if (response.data && Array.isArray(response.data)) {
                // Lấy 100 phiên mới nhất từ API game
                this.history = response.data.slice(0, 100); 
                this.updateSessionStats(); 
                console.log("Dữ liệu KuBinDev đã tự động cập nhật từ Game!");
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu game:", error.message);
        }
    }// <--- Tìm dấu này ở khoảng dòng 460

    model5Support2() {
        return {
            correlationMatrix: this.calculateModelCorrelations(),
            diversityScore: this.calculateModelDiversity(),
            ensembleOptimal: this.findOptimalEnsemble()
        };
    }

    analyzePredictionBalance(predictions) {
        let tCount = 0, xCount = 0;
        let totalConfidence = 0;
        
        for (const pred of Object.values(predictions)) {
            if (pred && pred.prediction) {
                if (pred.prediction === 'T') tCount++;
                else xCount++;
                totalConfidence += pred.confidence || 0;
            }
        }
        
        const total = tCount + xCount;
        const imbalance = Math.abs(tCount - xCount) / total;
        const avgConfidence = totalConfidence / total;
        
        return {
            tCount,
            xCount,
            total,
            imbalance,
            avgConfidence,
            majority: tCount > xCount ? 'T' : 'X'
        };
    }

    // ==================== MODEL 6: BẮT THEO CẦU HAY BẺ CẦU ====================
    model6() {
        const streak = this.calculateCurrentStreak();
        const breakProbability = this.calculateBreakProbability();
        const trendStrength = this.analyzeTrend(20).strength;
        
        const decision = this.makeBreakDecision(streak, breakProbability, trendStrength);
        
        return {
            prediction: decision.prediction,
            confidence: decision.confidence,
            reason: `Streak hiện tại: ${streak} - Xác suất bẻ: ${(breakProbability*100).toFixed(1)}% - ${decision.reason}`
        };
    }

    model6Mini(data) {
        return this.calculateBreakProbability(data);
    }

    model6Support1() {
        return {
            breakHistory: this.analyzeBreakHistory(),
            optimalBreakConditions: this.findOptimalBreakConditions(),
            riskRewardAnalysis: this.analyzeRiskReward()
        };
    }

    model6Support2() {
        return {
            breakPatterns: this.identifyBreakPatterns(),
            continuationSignals: this.detectContinuationSignals(),
            adaptiveThresholds: this.calculateBreakThresholds()
        };
    }

    makeBreakDecision(streak, breakProb, trendStrength) {
        let prediction, confidence, reason;
        
        // Logic quyết định thông minh
        if (streak >= 7 && breakProb > 0.7) {
            prediction = this.history[this.history.length - 1] === 'T' ? 'X' : 'T';
            confidence = breakProb * 0.9;
            reason = 'Streak dài + xác suất bẻ cao -> Bẻ cầu';
        } else if (streak >= 5 && breakProb > 0.6 && trendStrength < 0.5) {
            prediction = this.history[this.history.length - 1] === 'T' ? 'X' : 'T';
            confidence = breakProb * 0.8;
            reason = 'Streak trung bình + trend yếu -> Bẻ cầu';
        } else if (trendStrength > 0.7 && breakProb < 0.4) {
            prediction = this.history[this.history.length - 1];
            confidence = trendStrength * 0.9;
            reason = 'Trend mạnh + xác suất bẻ thấp -> Theo trend';
        } else {
            prediction = this.history[this.history.length - 1];
            confidence = 0.6;
            reason = 'Không có tín hiệu rõ ràng -> Giữ nguyên';
        }
        
        return { prediction, confidence, reason };
    }

    // ==================== MODEL 7: CÂN BẰNG TRỌNG SỐ KHI CHÊNH LỆCH CAO ====================
    model7() {
        const performanceGap = this.calculatePerformanceGap();
        
        if (performanceGap > 0.3) {
            this.rebalanceWeights();
            
            return {
                prediction: null,
                confidence: 0,
                reason: `Điều chỉnh trọng số do chênh lệch hiệu suất ${(performanceGap*100).toFixed(1)}%`
            };
        }
        
        return null;
    }

    model7Mini(performance) {
        return this.calculatePerformanceGap(performance);
    }

    model7Support1() {
        return {
            weightEvolution: this.trackWeightEvolution(),
            performanceImpact: this.analyzeWeightImpact(),
            optimizationPath: this.findOptimalWeightPath()
        };
    }

    model7Support2() {
        return {
            adaptiveRates: this.calculateAdaptiveRates(),
            stabilityMetrics: this.measureWeightStability(),
            rebalancingSchedule: this.determineRebalancingSchedule()
        };
    }

    rebalanceWeights() {
        const performances = this.performance;
        const avgPerformance = this.calculateAveragePerformance();
        
        for (const [model, perf] of Object.entries(performances)) {
            if (perf.total > 10) {
                const accuracy = perf.correct / perf.total;
                const deviation = accuracy - avgPerformance;
                
                // Điều chỉnh weight dựa trên độ lệch
                this.weights[model] = Math.max(0.1, Math.min(2, 1 + deviation * 3));
                
                // Bonus cho consistency
                if (perf.consistency > 0.7) {
                    this.weights[model] *= 1.1;
                }
            }
        }
    }

    // ==================== MODEL 8: NHẬN BIẾT CẦU XẤU ====================
    model8() {
        const randomness = this.measureRandomness(30);
        const quality = this.assessCandleQuality();
        
        if (randomness > 0.7 || quality.score < 0.3) {
            this.adjustForBadCandle();
            
            return {
                prediction: null,
                confidence: 0,
                reason: `Phát hiện cầu xấu - Độ ngẫu nhiên: ${(randomness*100).toFixed(1)}%, Chất lượng: ${quality.level}`
            };
        }
        
        return null;
    }

    model8Mini(data) {
        return this.measureRandomness(data.length, data);
    }

    model8Support1() {
        return {
            randomnessIndicators: this.calculateRandomnessIndicators(),
            qualityMetrics: this.calculateQualityMetrics(),
            adaptationStrategy: this.suggestAdaptationStrategy()
        };
    }

    model8Support2() {
        return {
            patternClarity: this.assessPatternClarity(),
            noiseLevel: this.measureNoiseLevel(),
            signalStrength: this.calculateSignalStrength()
        };
    }

    measureRandomness(period, data = this.history) {
        if (data.length < period) return 0.5;
        
        const segment = data.slice(-period);
        
        // Đo lường entropy
        const tCount = segment.filter(x => x === 'T').length;
        const xCount = segment.filter(x => x === 'X').length;
        const pT = tCount / period;
        const pX = xCount / period;
        
        let entropy = 0;
        if (pT > 0) entropy -= pT * Math.log2(pT);
        if (pX > 0) entropy -= pX * Math.log2(pX);
        const maxEntropy = 1; // log2(2)
        const normalizedEntropy = entropy / maxEntropy;
        
        // Đo lường sự thay đổi
        let changes = 0;
        for (let i = 1; i < segment.length; i++) {
            if (segment[i] !== segment[i-1]) changes++;
        }
        const changeRate = changes / (segment.length - 1);
        
        // Đo lường tính tuần hoàn
        let periodicity = this.detectPeriodicity(segment);
        
        // Kết hợp các chỉ số
        const randomness = (normalizedEntropy * 0.4 + changeRate * 0.4 + (1 - periodicity) * 0.2);
        
        return randomness;
    }

    // ==================== MODEL 9: NHẬN BIẾT CÁC LOẠI CẦU CƠ BẢN (NÂNG CAO) ====================
    model9() {
        const patterns = this.detectAdvancedPatterns();
        
        if (patterns.length === 0) return null;
        
        const bestPattern = this.selectBestAdvancedPattern(patterns);
        
        return {
            prediction: bestPattern.prediction,
            confidence: bestPattern.confidence,
            reason: `Phát hiện pattern nâng cao: ${bestPattern.name} - ${bestPattern.description} (độ tin cậy ${(bestPattern.confidence*100).toFixed(1)}%)`
        };
    }

    model9Mini(data) {
        return this.detectAdvancedPatterns(data);
    }

    model9Support1() {
        return {
            patternComplexity: this.analyzePatternComplexity(),
            patternEvolution: this.trackPatternEvolution(),
            patternReliability: this.assessPatternReliability()
        };
    }

    model9Support2() {
        return {
            patternClusters: this.identifyPatternClusters(),
            patternTransitions: this.analyzePatternTransitions(),
            patternLifecycle: this.trackPatternLifecycle()
        };
    }

    detectAdvancedPatterns(data = this.history) {
        const patterns = [];
        
        // Fibonacci patterns
        const fibPatterns = this.detectFibonacciPatterns(data);
        patterns.push(...fibPatterns);
        
        // Harmonic patterns
        const harmonicPatterns = this.detectHarmonicPatterns(data);
        patterns.push(...harmonicPatterns);
        
        // Geometric patterns
        const geometricPatterns = this.detectGeometricPatterns(data);
        patterns.push(...geometricPatterns);
        
        // Wave patterns
        const wavePatterns = this.detectWavePatterns(data);
        patterns.push(...wavePatterns);
        
        // Cyclic patterns
        const cyclicPatterns = this.detectCyclicPatterns(data);
        patterns.push(...cyclicPatterns);
        
        return patterns;
    }

    // ==================== MODEL 10: XÁC SUẤT BẺ CẦU ====================
    model10() {
        const breakProb = this.calculateAdvancedBreakProbability();
        
        return {
            prediction: breakProb.prediction,
            confidence: breakProb.probability,
            reason: `Xác suất bẻ cầu tổng hợp: ${(breakProb.probability*100).toFixed(1)}% - Dựa trên ${breakProb.factors} yếu tố`
        };
    }

    model10Mini(data) {
        return this.calculateBreakProbability(data);
    }

    model10Support1() {
        return {
            breakFactors: this.analyzeBreakFactors(),
            factorWeights: this.calculateFactorWeights(),
            probabilityZones: this.identifyProbabilityZones()
        };
    }

    model10Support2() {
        return {
            breakHistory: this.analyzeDetailedBreakHistory(),
            conditionalProbabilities: this.calculateConditionalProbabilities(),
            monteCarloSimulation: this.runMonteCarloSimulation()
        };
    }

    calculateAdvancedBreakProbability() {
        const methods = [
            { weight: 0.25, prob: this.model10Mini(this.history) },
            { weight: 0.20, prob: this.model14Mini(this.history) },
            { weight: 0.20, prob: this.calculateMarkovBreakProb() },
            { weight: 0.20, prob: this.calculateBayesianBreakProb() },
            { weight: 0.15, prob: this.calculateMachineLearningBreakProb() }
        ];
        
        let totalProb = 0;
        let totalWeight = 0;
        let factors = 0;
        
        for (const method of methods) {
            if (method.prob > 0) {
                totalProb += method.prob * method.weight;
                totalWeight += method.weight;
                factors++;
            }
        }
        
        const probability = totalWeight > 0 ? totalProb / totalWeight : 0.5;
        const prediction = probability > 0.6 ? 
            (this.history[this.history.length - 1] === 'T' ? 'X' : 'T') : 
            this.history[this.history.length - 1];
        
        return {
            probability,
            prediction,
            factors
        };
    }

    // ==================== MODEL 11: BIẾN ĐỘNG XÚC XẮC ====================
    model11() {
        const volatility = this.analyzeVolatility();
        const prediction = this.predictFromVolatility(volatility);
        
        return {
            prediction: prediction.value,
            confidence: prediction.confidence,
            reason: `Phân tích biến động: ${volatility.level} - Xu hướng: ${volatility.trend} - Dự đoán theo nguyên lý xúc xắc`
        };
    }

    model11Mini(data) {
        return this.analyzeVolatility(data);
    }

    model11Support1() {
        return {
            volatilityIndicators: this.calculateVolatilityIndicators(),
            volatilityCycles: this.identifyVolatilityCycles(),
            volatilityForecast: this.forecastVolatility()
        };
    }

    model11Support2() {
        return {
            dicePrinciples: this.analyzeDicePrinciples(),
            probabilityDistribution: this.calculateProbabilityDistribution(),
            statisticalArbitrage: this.findStatisticalArbitrage()
        };
    }

    analyzeVolatility(data = this.history) {
        if (data.length < 20) return { level: 'medium', value: 0.5, trend: 'unknown' };
        
        const segment = data.slice(-20);
        
        // Tính toán biến động
        let changes = 0;
        for (let i = 1; i < segment.length; i++) {
            if (segment[i] !== segment[i-1]) changes++;
        }
        const changeRate = changes / (segment.length - 1);
        
        // Xu hướng biến động
        let trend = 0;
        for (let i = 5; i < segment.length; i += 5) {
            const subSegment = segment.slice(i-5, i);
            let subChanges = 0;
            for (let j = 1; j < subSegment.length; j++) {
                if (subSegment[j] !== subSegment[j-1]) subChanges++;
            }
            const subRate = subChanges / (subSegment.length - 1);
            trend += (subRate - changeRate);
        }
        
        let level;
        if (changeRate < 0.3) level = 'low';
        else if (changeRate < 0.6) level = 'medium';
        else level = 'high';
        
        return {
            level,
            value: changeRate,
            trend: trend > 0 ? 'increasing' : (trend < 0 ? 'decreasing' : 'stable'),
            raw: changeRate
        };
    }

    // ==================== MODEL 12: MẪU CẦU NGẮN ====================
    model12() {
        const shortPatterns = this.detectShortPatterns(8);
        
        if (shortPatterns.length === 0) return null;
        
        const bestPattern = this.selectBestShortPattern(shortPatterns);
        
        return {
            prediction: bestPattern.prediction,
            confidence: bestPattern.confidence,
            reason: `Mẫu cầu ngắn: ${bestPattern.pattern} - Tần suất: ${bestPattern.frequency} lần - Độ tin cậy: ${(bestPattern.confidence*100).toFixed(1)}%`
        };
    }

    model12Mini(data) {
        return this.detectShortPatterns(data.length, data);
    }

    model12Support1() {
        return {
            shortPatternLibrary: this.getShortPatternLibrary(),
            patternEffectiveness: this.analyzeShortPatternEffectiveness(),
            optimalLength: this.findOptimalShortPatternLength()
        };
    }

    model12Support2() {
        return {
            microPatterns: this.detectMicroPatterns(),
            patternCombinations: this.analyzePatternCombinations(),
            realTimePatterns: this.detectRealTimePatterns()
        };
    }

    detectShortPatterns(length, data = this.history) {
        if (data.length < length) return [];
        
        const patterns = [];
        const segment = data.slice(-length);
        
        // Pattern database cho mẫu ngắn
        const shortPatternDB = {
            'T-X-T-X': { next: 'T', confidence: 0.65 },
            'X-T-X-T': { next: 'X', confidence: 0.65 },
            'T-T-X-X': { next: 'T', confidence: 0.7 },
            'X-X-T-T': { next: 'X', confidence: 0.7 },
            'T-X-X-T': { next: 'X', confidence: 0.68 },
            'X-T-T-X': { next: 'T', confidence: 0.68 },
            'T-T-T-X': { next: 'X', confidence: 0.72 },
            'X-X-X-T': { next: 'T', confidence: 0.72 },
            'T-X-T-T': { next: 'X', confidence: 0.66 },
            'X-T-X-X': { next: 'T', confidence: 0.66 }
        };
        
        for (let i = 3; i <= Math.min(5, length); i++) {
            const subSegment = segment.slice(-i);
            const patternKey = subSegment.join('-');
            
            if (shortPatternDB[patternKey]) {
                const frequency = this.countPatternOccurrences(patternKey);
                patterns.push({
                    pattern: patternKey,
                    prediction: shortPatternDB[patternKey].next,
                    confidence: shortPatternDB[patternKey].confidence * (1 + Math.min(0.2, frequency / 20)),
                    frequency: frequency,
                    length: i
                });
            }
        }
        
        return patterns;
    }

    // ==================== MODEL 13: ĐÁNH GIÁ HIỆU SUẤT ====================
    model13() {
        const performance = this.calculateDetailedPerformance();
        const bestModel = this.findBestPerformingModel(performance);
        
        return {
            prediction: null,
            confidence: bestModel.accuracy,
            reason: `Model hiệu suất cao nhất: ${bestModel.name} - Accuracy: ${(bestModel.accuracy*100).toFixed(1)}% - Streak: ${bestModel.streak} - Độ ổn định: ${(bestModel.consistency*100).toFixed(1)}%`
        };
    }

    model13Mini() {
        return this.calculateDetailedPerformance();
    }

    model13Support1() {
        return {
            modelRanking: this.rankModels(),
            performanceTrends: this.analyzePerformanceTrends(),
            modelCorrelations: this.calculateModelCorrelations()
        };
    }

    model13Support2() {
        return {
            optimizationSuggestions: this.suggestModelOptimizations(),
            weightRecommendations: this.recommendWeights(),
            ensembleStrategies: this.suggestEnsembleStrategies()
        };
    }

    calculateDetailedPerformance() {
        const detailed = {};
        
        for (const [model, perf] of Object.entries(this.performance)) {
            if (perf.total > 0) {
                const accuracy = perf.correct / perf.total;
                const recentAccuracy = perf.recentTotal > 0 ? 
                    perf.recentCorrect / perf.recentTotal : accuracy;
                
                // Tính độ ổn định
                let consistency = 0;
                if (perf.lastPredictions.length > 10) {
                    const recent = perf.lastPredictions.slice(-10);
                    const correct = recent.filter(p => p).length;
                    consistency = correct / recent.length;
                }
                
                detailed[model] = {
                    accuracy,
                    recentAccuracy,
                    consistency,
                    streak: perf.streak,
                    maxStreak: perf.maxStreak,
                    total: perf.total,
                    recentTotal: perf.recentTotal,
                    trend: recentAccuracy - accuracy,
                    reliability: accuracy * consistency
                };
            }
        }
        
        return detailed;
    }

    // ==================== MODEL 14: XÁC SUẤT BẺ CẦU XU HƯỚNG ====================
    model14() {
        const trendBreakProb = this.calculateTrendBreakProbability();
        
        return {
            prediction: trendBreakProb.prediction,
            confidence: trendBreakProb.probability,
            reason: `Xác suất bẻ cầu xu hướng: ${(trendBreakProb.probability*100).toFixed(1)}% - Dựa trên độ mạnh trend và lịch sử bẻ`
        };
    }

    model14Mini(data) {
        return this.calculateTrendBreakProbability(data);
    }

    model14Support1() {
        return {
            trendStrength: this.measureTrendStrength(),
            breakHistory: this.analyzeTrendBreakHistory(),
            breakConditions: this.identifyBreakConditions()
        };
    }

    model14Support2() {
        return {
            trendResistance: this.calculateTrendResistance(),
            breakTriggers: this.identifyBreakTriggers(),
            confirmationSignals: this.detectConfirmationSignals()
        };
    }

    calculateTrendBreakProbability(data = this.history) {
        if (data.length < 30) return { probability: 0.5, prediction: 'unknown' };
        
        const trend = this.analyzeTrend(20, data);
        const recent = data.slice(-10);
        
        // Phân tích lịch sử bẻ trend
        let breakCount = 0;
        let opportunities = 0;
        
        for (let i = 20; i < data.length; i++) {
            const pastTrend = this.analyzeTrend(20, data.slice(0, i));
            if (pastTrend.strength > 0.6) {
                opportunities++;
                if (data[i] !== pastTrend.direction) {
                    breakCount++;
                }
            }
        }
        
        const historicalBreakRate = opportunities > 0 ? breakCount / opportunities : 0.5;
        
        // Điều chỉnh dựa trên độ mạnh trend hiện tại
        let probability = historicalBreakRate;
        if (trend.strength > 0.7) {
            probability *= 0.7; // Trend mạnh -> khó bẻ
        } else if (trend.strength < 0.4) {
            probability *= 1.3; // Trend yếu -> dễ bẻ
        }
        
        probability = Math.min(0.95, Math.max(0.05, probability));
        
        const prediction = probability > 0.6 ? 
            (trend.direction === 'T' ? 'X' : 'T') : trend.direction;
        
        return { probability, prediction };
    }

    // ==================== MODEL 15: NÊN BẮT THEO XU HƯỚNG KHÔNG ====================
    model15() {
        const analysis = this.analyzeTrendFollowing();
        
        return {
            prediction: analysis.prediction,
            confidence: analysis.confidence,
            reason: `Phân tích theo xu hướng: ${analysis.decision} - Risk/Reward: ${analysis.riskReward.toFixed(2)} - ${analysis.reason}`
        };
    }

    model15Mini(data) {
        return this.analyzeTrendFollowing(data);
    }

    model15Support1() {
        return {
            riskAnalysis: this.analyzeRiskRewardRatio(),
            successProbability: this.calculateSuccessProbability(),
            optimalStrategy: this.findOptimalStrategy()
        };
    }

    model15Support2() {
        return {
            scenarioAnalysis: this.analyzeScenarios(),
            monteCarloResults: this.runTrendMonteCarlo(),
            confidenceIntervals: this.calculateConfidenceIntervals()
        };
    }

    analyzeTrendFollowing(data = this.history) {
        const trend = this.analyzeTrend(20, data);
        const breakProb = this.calculateTrendBreakProbability(data);
        const volatility = this.analyzeVolatility(data);
        
        // Tính risk/reward
        const potentialGain = trend.strength;
        const potentialLoss = breakProb.probability;
        const riskReward = potentialGain / (potentialLoss + 0.01);
        
        let decision, prediction, confidence, reason;
        
        if (riskReward > 2.0) {
            decision = 'THEO_TREND';
            prediction = trend.direction;
            confidence = Math.min(0.9, trend.strength * 0.8);
            reason = 'Risk/Reward rất tốt';
        } else if (riskReward > 1.0) {
            decision = 'THEO_TREND_NHE';
            prediction = trend.direction;
            confidence = trend.strength * 0.6;
            reason = 'Risk/Reward chấp nhận được';
        } else if (breakProb.probability > 0.7) {
            decision = 'BE_CAU';
            prediction = trend.direction === 'T' ? 'X' : 'T';
            confidence = breakProb.probability * 0.7;
            reason = 'Xác suất bẻ cao';
        } else {
            decision = 'DO_NOTHING';
            prediction = 'neutral';
            confidence = 0.3;
            reason = 'Không đủ tín hiệu rõ ràng';
        }
        
        return {
            decision,
            prediction,
            confidence,
            riskReward,
            reason
        };
    }

    // ==================== MODEL 16: XÁC SUẤT BẺ CẦU TỔNG HỢP ====================
    model16() {
        const breakProb = this.calculateComprehensiveBreakProbability();
        
        return {
            prediction: breakProb.prediction,
            confidence: breakProb.probability,
            reason: `Xác suất bẻ cầu tổng hợp: ${(breakProb.probability*100).toFixed(1)}% - Kết hợp ${breakProb.methods} phương pháp`
        };
    }

    model16Mini(data) {
        return this.calculateComprehensiveBreakProbability(data);
    }

    model16Support1() {
        return {
            methodWeights: this.calculateMethodWeights(),
            methodPerformance: this.analyzeMethodPerformance(),
            optimalCombination: this.findOptimalMethodCombination()
        };
    }

    model16Support2() {
        return {
            convergenceAnalysis: this.analyzeMethodConvergence(),
            divergenceSignals: this.detectDivergenceSignals(),
            ensemblePredictions: this.generateEnsemblePredictions()
        };
    }

    calculateComprehensiveBreakProbability(data = this.history) {
        const methods = [
            { name: 'Simple Break', prob: this.model10Mini(data) },
            { name: 'Trend Break', prob: this.model14Mini(data).probability },
            { name: 'Markov', prob: this.calculateMarkovBreakProb(data) },
            { name: 'Pattern', prob: this.calculatePatternBreakProb(data) },
            { name: 'Momentum', prob: this.calculateMomentumBreakProb(data) },
            { name: 'Volatility', prob: this.calculateVolatilityBreakProb(data) },
            { name: 'Machine Learning', prob: this.calculateMLBreakProb(data) }
        ];
        
        // Lọc các phương pháp có dữ liệu
        const validMethods = methods.filter(m => m.prob > 0);
        
        // Tính trọng số dựa trên hiệu suất lịch sử
        let totalProb = 0;
        let totalWeight = 0;
        
        for (const method of validMethods) {
            const weight = this.getMethodWeight(method.name);
            totalProb += method.prob * weight;
            totalWeight += weight;
        }
        
        const probability = totalWeight > 0 ? totalProb / totalWeight : 0.5;
        const prediction = probability > 0.6 ? 
            (data[data.length - 1] === 'T' ? 'X' : 'T') : 
            data[data.length - 1];
        
        return {
            probability,
            prediction,
            methods: validMethods.length
        };
    }

    // ==================== MODEL 17: CÂN BẰNG TRỌNG SỐ NÂNG CAO ====================
    model17() {
        const imbalance = this.measureWeightImbalance();
        
        if (imbalance > 0.2) {
            this.advancedWeightRebalancing();
            
            return {
                prediction: null,
                confidence: 0,
                reason: `Cân bằng trọng số nâng cao - Độ mất cân bằng: ${(imbalance*100).toFixed(1)}% - Điều chỉnh dựa trên hiệu suất và độ ổn định`
            };
        }
        
        return null;
    }

    model17Mini(weights) {
        return this.measureWeightImbalance(weights);
    }

    model17Support1() {
        return {
            weightMetrics: this.calculateWeightMetrics(),
            optimizationPath: this.findWeightOptimizationPath(),
            stabilityAnalysis: this.analyzeWeightStability()
        };
    }

    model17Support2() {
        return {
            adaptiveRates: this.calculateAdaptiveRates(),
            convergenceSpeed: this.measureConvergenceSpeed(),
            optimalState: this.findOptimalWeightState()
        };
    }

    advancedWeightRebalancing() {
        const performance = this.calculateDetailedPerformance();
        const weights = this.weights;
        
        // Tính điểm cho mỗi model
        const scores = {};
        for (const [model, perf] of Object.entries(performance)) {
            if (perf) {
                scores[model] = (
                    perf.accuracy * 0.3 +
                    perf.recentAccuracy * 0.3 +
                    perf.consistency * 0.2 +
                    (perf.streak / 10) * 0.2
                );
            }
        }
        
        // Chuẩn hóa scores
        const maxScore = Math.max(...Object.values(scores));
        const minScore = Math.min(...Object.values(scores));
        
        for (const [model, score] of Object.entries(scores)) {
            if (maxScore > minScore) {
                const normalizedScore = (score - minScore) / (maxScore - minScore);
                // Điều chỉnh weight
                this.weights[model] = 0.5 + normalizedScore;
            } else {
                this.weights[model] = 1.0;
            }
        }
    }

    // ==================== MODEL 18: XU HƯỚNG CẦU NGẮN HẠN ====================
    model18() {
        const shortTrend = this.analyzeShortTermTrend(6);
        
        return {
            prediction: shortTrend.prediction,
            confidence: shortTrend.confidence,
            reason: `Xu hướng ngắn hạn: ${shortTrend.direction} - Độ mạnh: ${(shortTrend.strength*100).toFixed(1)}% - ${shortTrend.description}`
        };
    }

    model18Mini(data) {
        return this.analyzeShortTermTrend(data.length, data);
    }

    model18Support1() {
        return {
            microTrends: this.detectMicroTrends(),
            trendReversals: this.identifyReversalSignals(),
            momentumIndicators: this.calculateMomentumIndicators()
        };
    }

    model18Support2() {
        return {
            trendQuality: this.assessShortTermTrendQuality(),
            entryPoints: this.findShortTermEntryPoints(),
            exitSignals: this.detectExitSignals()
        };
    }

    analyzeShortTermTrend(period, data = this.history) {
        if (data.length < period) return { prediction: null, confidence: 0 };
        
        const segment = data.slice(-period);
        const tCount = segment.filter(x => x === 'T').length;
        const xCount = segment.filter(x => x === 'X').length;
        
        let direction, strength, description;
        
        if (tCount > xCount * 2) {
            direction = 'T';
            strength = 0.8;
            description = 'T áp đảo';
        } else if (xCount > tCount * 2) {
            direction = 'X';
            strength = 0.8;
            description = 'X áp đảo';
        } else if (tCount > xCount) {
            direction = 'T';
            strength = 0.6;
            description = 'T nhỉnh hơn';
        } else if (xCount > tCount) {
            direction = 'X';
            strength = 0.6;
            description = 'X nhỉnh hơn';
        } else {
            direction = data[data.length - 1];
            strength = 0.5;
            description = 'Cân bằng';
        }
        
        // Điều chỉnh dựa trên momentum
        const momentum = this.calculateMomentum(segment);
        strength = strength * (0.5 + Math.abs(momentum) / 2);
        
        return {
            direction,
            strength,
            prediction: direction,
            confidence: strength,
            description,
            momentum
        };
    }

    // ==================== MODEL 19: XU HƯỚNG PHỔ BIẾN ====================
    model19() {
        const popularTrends = this.identifyPopularTrends();
        
        if (popularTrends.length === 0) return null;
        
        const bestTrend = popularTrends[0];
        
        return {
            prediction: bestTrend.prediction,
            confidence: bestTrend.confidence,
            reason: `Xu hướng phổ biến: ${bestTrend.pattern} - Xuất hiện ${bestTrend.frequency} lần - Tỷ lệ thành công: ${(bestTrend.successRate*100).toFixed(1)}%`
        };
    }

    model19Mini(data) {
        return this.identifyPopularTrends(data);
    }

    model19Support1() {
        return {
            trendRanking: this.rankPopularTrends(),
            trendEvolution: this.analyzeTrendEvolution(),
            trendLifecycle: this.trackTrendLifecycle()
        };
    }

    model19Support2() {
        return {
            trendCorrelations: this.analyzeTrendCorrelations(),
            trendPredictability: this.measureTrendPredictability(),
            trendTransitions: this.analyzeTrendTransitions()
        };
    }

    identifyPopularTrends(data = this.history) {
        if (data.length < 20) return [];
        
        const trends = [];
        const patternCounts = new Map();
        const patternSuccess = new Map();
        
        // Thu thập patterns phổ biến
        for (let len = 3; len <= 6; len++) {
            for (let i = 0; i <= data.length - len; i++) {
                const pattern = data.slice(i, i + len).join('-');
                patternCounts.set(pattern, (patternCounts.get(pattern) || 0) + 1);
                
                // Kiểm tra thành công
                if (i + len < data.length) {
                    const next = data[i + len];
                    const expected = this.getExpectedFromPattern(pattern);
                    if (expected === next) {
                        patternSuccess.set(pattern, (patternSuccess.get(pattern) || 0) + 1);
                    }
                }
            }
        }
        
        // Phân tích và ranking
        for (const [pattern, count] of patternCounts) {
            if (count >= 3) {
                const success = patternSuccess.get(pattern) || 0;
                const successRate = success / count;
                const expected = this.getExpectedFromPattern(pattern);
                
                trends.push({
                    pattern,
                    prediction: expected,
                    frequency: count,
                    successRate,
                    confidence: successRate * Math.min(1, count / 10)
                });
            }
        }
        
        // Sort theo độ phổ biến và tỷ lệ thành công
        return trends.sort((a, b) => 
            (b.frequency * b.successRate) - (a.frequency * a.successRate)
        ).slice(0, 5);
    }

    // ==================== MODEL 20: MAX PERFORMANCE ====================
    model20() {
        const topModels = this.getTopPerformingModels(5);
        const ensemble = this.createEnsemble(topModels);
        
        return {
            prediction: ensemble.prediction,
            confidence: ensemble.confidence,
            reason: `Ensemble của ${topModels.length} model top đầu: ${topModels.map(m => m.name).join(', ')} - Điểm tổng hợp: ${(ensemble.score*100).toFixed(1)}%`
        };
    }

    model20Mini() {
        return this.getTopPerformingModels();
    }

    model20Support1() {
        return {
            ensembleComposition: this.analyzeEnsembleComposition(),
            performanceMetrics: this.calculateEnsembleMetrics(),
            optimizationResults: this.optimizeEnsemble()
        };
    }

    model20Support2() {
        return {
            modelSynergy: this.analyzeModelSynergy(),
            diversityMetrics: this.calculateDiversityMetrics(),
            adaptiveEnsemble: this.createAdaptiveEnsemble()
        };
    }

    createEnsemble(models) {
        let tScore = 0;
        let xScore = 0;
        let totalWeight = 0;
        
        for (const model of models) {
            const prediction = this.models[model.name]();
            if (prediction && prediction.prediction) {
                const weight = this.weights[model.name] || 1;
                const confidence = prediction.confidence || 0.5;
                
                if (prediction.prediction === 'T') {
                    tScore += weight * confidence * model.performance;
                } else {
                    xScore += weight * confidence * model.performance;
                }
                totalWeight += weight;
            }
        }
        
        const total = tScore + xScore;
        const prediction = tScore > xScore ? 'T' : 'X';
        const confidence = total > 0 ? Math.max(tScore, xScore) / total : 0.5;
        
        return {
            prediction,
            confidence,
            score: Math.max(tScore, xScore)
        };
    }

    // ==================== MODEL 21: CÂN BẰNG TỔNG THỂ ====================
    model21() {
        const globalImbalance = this.measureGlobalImbalance();
        
        if (globalImbalance > 0.4) {
            const balanced = this.globalBalancing();
            
            return {
                prediction: balanced.prediction,
                confidence: balanced.confidence,
                reason: `Cân bằng tổng thể - Độ mất cân bằng: ${(globalImbalance*100).toFixed(1)}% - Điều chỉnh dựa trên ${balanced.factors} yếu tố`
            };
        }
        
        return null;
    }

    model21Mini() {
        return this.measureGlobalImbalance();
    }

    model21Support1() {
        return {
            globalMetrics: this.calculateGlobalMetrics(),
            balanceFactors: this.analyzeBalanceFactors(),
            equilibriumPoint: this.findEquilibriumPoint()
        };
    }

    model21Support2() {
        return {
            systemicRisks: this.analyzeSystemicRisks(),
            stabilityIndicators: this.calculateStabilityIndicators(),
            optimalBalance: this.findOptimalBalance()
        };
    }

    measureGlobalImbalance() {
        const predictions = this.getAllPredictions();
        const balance = this.analyzePredictionBalance(predictions);
        
        const weightImbalance = this.measureWeightImbalance();
        const performanceImbalance = this.measurePerformanceImbalance();
        
        return (balance.imbalance * 0.4 + weightImbalance * 0.3 + performanceImbalance * 0.3);
    }

    globalBalancing() {
        const predictions = this.getAllPredictions();
        const weights = this.weights;
        const performance = this.calculateDetailedPerformance();
        
        let tScore = 0;
        let xScore = 0;
        let factors = 0;
        
        // Kết hợp nhiều yếu tố
        for (const [model, pred] of Object.entries(predictions)) {
            if (pred && pred.prediction) {
                const weight = weights[model] || 1;
                const perf = performance[model] || { accuracy: 0.5 };
                
                // Điều chỉnh dựa trên hiệu suất
                const adjustedWeight = weight * (0.5 + perf.accuracy);
                
                if (pred.prediction === 'T') {
                    tScore += adjustedWeight * pred.confidence;
                } else {
                    xScore += adjustedWeight * pred.confidence;
                }
                factors++;
            }
        }
        
        // Thêm yếu tố thị trường
        const marketBias = this.calculateMarketBias();
        if (marketBias > 0.6) {
            if (marketBias > 0.7) {
                tScore *= 1.2;
            } else {
                xScore *= 1.2;
            }
        }
        
        const total = tScore + xScore;
        const prediction = tScore > xScore ? 'T' : 'X';
        const confidence = total > 0 ? Math.max(tScore, xScore) / total : 0.5;
        
        return {
            prediction,
            confidence,
            factors
        };
    }

    // ==================== UTILITY FUNCTIONS ====================
    addResult(result) {
        // Thêm vào lịch sử
        this.history.push(result);
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        }
        
        // Cập nhật thống kê
        this.updateStats(result);
        
        // Học từ kết quả mới
        this.learnFromResult(result);
    }

    updateStats(result) {
        // Cập nhật streaks
        if (this.history.length > 1) {
            const last = this.history[this.history.length - 2];
            if (result === last) {
                this.sessionStats.streaks[result]++;
                this.sessionStats.streaks[`max${result}`] = Math.max(
                    this.sessionStats.streaks[`max${result}`],
                    this.sessionStats.streaks[result]
                );
            } else {
                this.sessionStats.streaks[result] = 1;
                this.sessionStats.streaks[last] = 0;
            }
            
            // Cập nhật transitions
            const transition = `${last}->${result}`;
            this.sessionStats.transitions[transition] = 
                (this.sessionStats.transitions[transition] || 0) + 1;
        } else {
            this.sessionStats.streaks[result] = 1;
        }
        
        // Cập nhật bias
        this.sessionStats.bias[result]++;
        
        // Tính volatility
        this.calculateVolatility();
        
        // Tính entropy
        this.calculateEntropy();
    }

    calculateVolatility() {
        if (this.history.length < 10) return;
        
        const recent = this.history.slice(-10);
        let changes = 0;
        for (let i = 1; i < recent.length; i++) {
            if (recent[i] !== recent[i-1]) changes++;
        }
        
        this.sessionStats.volatility = changes / (recent.length - 1);
    }

    calculateEntropy() {
        if (this.history.length < 10) return;
        
        const recent = this.history.slice(-50);
        const tCount = recent.filter(x => x === 'T').length;
        const xCount = recent.filter(x => x === 'X').length;
        const total = recent.length;
        
        const pT = tCount / total;
        const pX = xCount / total;
        
        let entropy = 0;
        if (pT > 0) entropy -= pT * Math.log2(pT);
        if (pX > 0) entropy -= pX * Math.log2(pX);
        
        this.sessionStats.entropy = entropy;
    }

    updatePerformance(actualResult) {
        const predictions = this.getAllPredictions();
        
        for (const [model, prediction] of Object.entries(predictions)) {
            if (prediction && prediction.prediction) {
                const perf = this.performance[model];
                perf.total++;
                perf.recentTotal++;
                perf.lastPredictions.push(prediction.prediction === actualResult);
                
                if (perf.lastPredictions.length > 50) {
                    perf.lastPredictions.shift();
                }
                
                if (prediction.prediction === actualResult) {
                    perf.correct++;
                    perf.recentCorrect++;
                    perf.streak++;
                    perf.maxStreak = Math.max(perf.maxStreak, perf.streak);
                } else {
                    perf.streak = 0;
                }
                
                perf.accuracy = perf.correct / perf.total;
                perf.recentAccuracy = perf.recentTotal > 0 ? 
                    perf.recentCorrect / perf.recentTotal : 0;
                
                // Tính consistency
                if (perf.lastPredictions.length > 10) {
                    const recent = perf.lastPredictions.slice(-10);
                    perf.consistency = recent.filter(p => p).length / recent.length;
                }
            }
        }
        
        // Cập nhật session stats
        this.sessionStats.predictions.total++;
        if (predictions.model20 && predictions.model20.prediction === actualResult) {
            this.sessionStats.predictions.correct++;
        }
        this.sessionStats.predictions.accuracy = 
            this.sessionStats.predictions.correct / this.sessionStats.predictions.total;
    }

    getAllPredictions() {
        const predictions = {};
        
        for (let i = 1; i <= 21; i++) {
            const modelName = `model${i}`;
            if (this.models[modelName]) {
                predictions[modelName] = this.models[modelName]();
            }
        }
        
        return predictions;
    }

    getFinalPrediction() {
        const predictions = this.getAllPredictions();
        const weights = this.weights;
        const performance = this.calculateDetailedPerformance();
        
        let tScore = 0;
        let xScore = 0;
        let totalWeight = 0;
        const reasons = [];
        
        for (const [model, pred] of Object.entries(predictions)) {
            if (pred && pred.prediction) {
                const weight = weights[model] || 1;
                const perf = performance[model] || { accuracy: 0.5, consistency: 0.5 };
                
                // Điều chỉnh weight dựa trên hiệu suất và consistency
                const adjustedWeight = weight * (0.5 + perf.accuracy) * (0.5 + perf.consistency);
                
                if (pred.prediction === 'T') {
                    tScore += adjustedWeight * (pred.confidence || 0.5);
                } else {
                    xScore += adjustedWeight * (pred.confidence || 0.5);
                }
                
                totalWeight += adjustedWeight;
                reasons.push(`${model}: ${pred.reason}`);
            }
        }
        
        if (totalWeight === 0) {
            return {
                prediction: 'T',
                confidence: 0.5,
                reasons: ['Không đủ dữ liệu'],
                details: predictions
            };
        }
        
        const prediction = tScore > xScore ? 'T' : 'X';
        const confidence = Math.max(tScore, xScore) / (tScore + xScore);
        
        // Điều chỉnh confidence dựa trên market state
        const adjustedConfidence = this.adjustConfidenceByMarket(confidence);
        
        return {
            prediction,
            confidence: adjustedConfidence,
            reasons: reasons.slice(0, 5), // Chỉ lấy 5 reasons tốt nhất
            details: predictions,
            marketState: this.marketState,
            sessionStats: this.sessionStats
        };
    }

    adjustConfidenceByMarket(confidence) {
        let adjusted = confidence;
        
        // Điều chỉnh dựa trên volatility
        if (this.sessionStats.volatility > 0.7) {
            adjusted *= 0.8;
        } else if (this.sessionStats.volatility < 0.3) {
            adjusted = Math.min(0.95, adjusted * 1.1);
        }
        
        // Điều chỉnh dựa trên entropy
        if (this.sessionStats.entropy > 0.9) {
            adjusted *= 0.9;
        } else if (this.sessionStats.entropy < 0.5) {
            adjusted *= 1.05;
        }
        
        // Điều chỉnh dựa trên recent accuracy
        if (this.sessionStats.predictions.accuracy > 0.6) {
            adjusted = Math.min(0.95, adjusted * 1.1);
        }
        
        return Math.min(0.98, Math.max(0.4, adjusted));
    }

    // ==================== LEARNING FUNCTIONS ====================
    learnFromHistory() {
        // Phân tích patterns mới
        this.discoverNewPatterns();
        
        // Cập nhật pattern database
        this.updatePatternDatabase();
        
        // Học từ các lần dự đoán sai
        this.learnFromMistakes();
        
        // Tối ưu hóa parameters
        this.optimizeParameters();
    }

    discoverNewPatterns() {
        if (this.history.length < 20) return;
        
        // Tìm patterns mới trong lịch sử
        for (let len = 2; len <= 8; len++) {
            for (let i = 0; i <= this.history.length - len - 1; i++) {
                const pattern = this.history.slice(i, i + len).join('-');
                const next = this.history[i + len];
                
                const key = `${pattern}->${next}`;
                this.patternLearning.frequencies.set(
                    key, 
                    (this.patternLearning.frequencies.get(key) || 0) + 1
                );
            }
        }
        
        // Cập nhật pattern predictions
        for (const [key, freq] of this.patternLearning.frequencies) {
            if (freq >= 3) {
                const [pattern, next] = key.split('->');
                this.patternLearning.predictions.set(pattern, next);
                this.patternLearning.accuracies.set(
                    pattern,
                    (this.patternLearning.accuracies.get(pattern) || 0) + 1
                );
            }
        }
    }

    learnFromMistakes() {
        const predictions = this.getAllPredictions();
        const lastResult = this.history[this.history.length - 1];
        
        for (const [model, pred] of Object.entries(predictions)) {
            if (pred && pred.prediction && pred.prediction !== lastResult) {
                // Giảm weight cho model dự đoán sai
                this.weights[model] = Math.max(0.3, this.weights[model] * 0.95);
                
                // Học từ sai lầm
                this.learnFromPredictionError(model, pred, lastResult);
            }
        }
    }

    learnFromPredictionError(model, prediction, actual) {
        // Phân tích lý do sai
        const error = {
            model,
            prediction: prediction.prediction,
            actual,
            confidence: prediction.confidence,
            time: Date.now(),
            marketState: { ...this.marketState }
        };
        
        // Lưu vào bộ nhớ lỗi để học
        if (!this.errorMemory) this.errorMemory = [];
        this.errorMemory.push(error);
        if (this.errorMemory.length > 100) this.errorMemory.shift();
        
        // Điều chỉnh dựa trên pattern của lỗi
        this.adaptFromErrorPatterns();
    }

    adaptFromErrorPatterns() {
        if (!this.errorMemory || this.errorMemory.length < 10) return;
        
        // Phân tích pattern lỗi
        const errorPatterns = new Map();
        for (let i = 0; i < this.errorMemory.length - 1; i++) {
            const key = `${this.errorMemory[i].model}_${this.errorMemory[i].prediction}`;
            errorPatterns.set(key, (errorPatterns.get(key) || 0) + 1);
        }
        
        // Điều chỉnh learning rate dựa trên error patterns
        for (const [key, count] of errorPatterns) {
            if (count > 3) {
                const [model] = key.split('_');
                // Tăng learning rate cho model có nhiều lỗi
                this.learningRate = Math.min(0.05, this.learningRate * 1.1);
            }
        }
    }

    updatePatternDatabase() {
        if (this.history.length < 50) return;
        
        // Cập nhật pattern database với patterns mới
        for (const [pattern, next] of this.patternLearning.predictions) {
            const accuracy = this.patternLearning.accuracies.get(pattern) || 0;
            const frequency = this.patternLearning.frequencies.get(`${pattern}->${next}`) || 0;
            
            if (frequency >= 3 && accuracy / frequency > 0.6) {
                // Thêm vào pattern database
                const patternKey = pattern;
                if (!this.patternDatabase.has(patternKey)) {
                    this.patternDatabase.set(patternKey, {
                        next,
                        accuracy: accuracy / frequency,
                        frequency,
                        lastSeen: Date.now()
                    });
                }
            }
        }
        
        // Xóa patterns cũ không còn hiệu quả
        const now = Date.now();
        for (const [pattern, info] of this.patternDatabase) {
            if (now - info.lastSeen > 7 * 24 * 60 * 60 * 1000) { // 7 ngày
                this.patternDatabase.delete(pattern);
            }
        }
    }

    optimizeParameters() {
        // Tối ưu hóa adaptive parameters dựa trên hiệu suất
        if (this.sessionStats.predictions.total > 100) {
            const accuracy = this.sessionStats.predictions.accuracy;
            
            if (accuracy < 0.5) {
                // Giảm learning rate nếu accuracy thấp
                this.adaptiveParams.learningRate *= 0.9;
            } else if (accuracy > 0.6) {
                // Tăng learning rate nếu accuracy cao
                this.adaptiveParams.learningRate = Math.min(0.02, this.adaptiveParams.learningRate * 1.1);
            }
            
            // Điều chỉnh pattern lengths dựa trên volatility
            if (this.sessionStats.volatility > 0.7) {
                this.adaptiveParams.patternMinLength = 2;
                this.adaptiveParams.patternMaxLength = 5;
            } else {
                this.adaptiveParams.patternMinLength = 2;
                this.adaptiveParams.patternMaxLength = 15;
            }
        }
    }

    adaptToMarket() {
        // Phân tích regime thị trường
        if (this.history.length < 30) return;
        
        const recent = this.history.slice(-30);
        const tCount = recent.filter(x => x === 'T').length;
        const xCount = recent.filter(x => x === 'X').length;
        const trendStrength = Math.abs(tCount - xCount) / 30;
        
        // Xác định regime
        if (this.sessionStats.volatility > 0.7) {
            this.marketState.regime = 'volatile';
            this.marketState.riskLevel = 'high';
        } else if (trendStrength > 0.6) {
            this.marketState.regime = 'trending';
            this.marketState.riskLevel = 'medium';
        } else if (trendStrength < 0.3 && this.sessionStats.volatility < 0.4) {
            this.marketState.regime = 'stable';
            this.marketState.riskLevel = 'low';
        } else {
            this.marketState.regime = 'normal';
            this.marketState.riskLevel = 'medium';
        }
        
        // Xác định cycle
        this.detectMarketCycle();
        
        // Lưu vào market memory
        this.marketMemory.push({
            time: Date.now(),
            regime: this.marketState.regime,
            volatility: this.sessionStats.volatility,
            trendStrength
        });
        
        if (this.marketMemory.length > 100) {
            this.marketMemory.shift();
        }
    }

    detectMarketCycle() {
        if (this.marketMemory.length < 20) return;
        
        // Phân tích chu kỳ thị trường
        const regimes = this.marketMemory.map(m => m.regime);
        let cycleLength = 0;
        let currentRegime = regimes[regimes.length - 1];
        
        for (let i = regimes.length - 1; i >= 0; i--) {
            if (regimes[i] === currentRegime) {
                cycleLength++;
            } else {
                break;
            }
        }
        
        if (cycleLength > 10) {
            this.marketState.cycle = 'long_' + currentRegime;
        } else if (cycleLength > 5) {
            this.marketState.cycle = 'medium_' + currentRegime;
        } else {
            this.marketState.cycle = 'short_' + currentRegime;
        }
    }

    // ==================== HELPER FUNCTIONS ====================
    arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    allEqual(arr, value) {
        return arr.every(item => item === value);
    }

    calculateMomentum(data) {
        if (data.length < 5) return 0;
        
        let momentum = 0;
        for (let i = 1; i < data.length; i++) {
            if (data[i] === data[i-1]) {
                momentum += data[i] === 'T' ? 1 : -1;
            }
        }
        
        return momentum / data.length;
    }

    calculatePatternStrength(pattern, data) {
        let strength = 0.5;
        const patternStr = pattern.join('-');
        
        // Kiểm tra tần suất xuất hiện
        let occurrences = 0;
        for (let i = 0; i <= data.length - pattern.length; i++) {
            const segment = data.slice(i, i + pattern.length);
            if (this.arraysEqual(segment, pattern)) {
                occurrences++;
            }
        }
        
        if (occurrences > 0) {
            strength = Math.min(0.9, 0.5 + occurrences / 20);
        }
        
        return strength;
    }

    getPatternFrequency(patternName) {
        let count = 0;
        for (let i = 0; i <= this.history.length - 4; i++) {
            const segment = this.history.slice(i, i + 4);
            const key = this.getPatternKey(segment);
            if (key === patternName) count++;
        }
        return count;
    }

    getPatternKey(segment) {
        // Convert segment to pattern key (e.g., "T-X-T-X")
        return segment.join('-');
    }

    calculateCurrentStreak() {
        if (this.history.length === 0) return 0;
        
        const last = this.history[this.history.length - 1];
        let streak = 1;
        
        for (let i = this.history.length - 2; i >= 0; i--) {
            if (this.history[i] === last) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    calculateBreakProbability(data = this.history) {
        if (data.length < 10) return 0.5;
        
        const streak = this.calculateCurrentStreak();
        let breakProb = 0.5;
        
        // Dựa trên streak length
        if (streak >= 7) {
            breakProb = 0.8;
        } else if (streak >= 5) {
            breakProb = 0.7;
        } else if (streak >= 4) {
            breakProb = 0.6;
        }
        
        // Điều chỉnh dựa trên historical break rate
        let breakCount = 0;
        let opportunities = 0;
        for (let i = 5; i < data.length; i++) {
            const subStreak = this.calculateStreakAt(data, i);
            if (subStreak >= 4) {
                opportunities++;
                if (data[i] !== data[i-1]) {
                    breakCount++;
                }
            }
        }
        
        const historicalRate = opportunities > 0 ? breakCount / opportunities : 0.5;
        breakProb = (breakProb + historicalRate) / 2;
        
        return breakProb;
    }

    calculateStreakAt(data, index) {
        if (index < 0 || index >= data.length) return 0;
        
        const value = data[index];
        let streak = 1;
        
        for (let i = index - 1; i >= 0; i--) {
            if (data[i] === value) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    detectPeriodicity(data) {
        // Simple periodicity detection
        let periodicity = 0;
        
        for (let period = 2; period <= 5; period++) {
            let matches = 0;
            for (let i = 0; i < data.length - period; i++) {
                if (data[i] === data[i + period]) {
                    matches++;
                }
            }
            periodicity = Math.max(periodicity, matches / (data.length - period));
        }
        
        return periodicity;
    }

    countPatternOccurrences(pattern) {
        const parts = pattern.split('-');
        let count = 0;
        
        for (let i = 0; i <= this.history.length - parts.length; i++) {
            const segment = this.history.slice(i, i + parts.length);
            if (segment.join('-') === pattern) {
                count++;
            }
        }
        
        return count;
    }

    getExpectedFromPattern(pattern) {
        // Simple heuristic: most common next value after pattern
        const parts = pattern.split('-');
        const last = parts[parts.length - 1];
        
        // Default: opposite of last
        return last === 'T' ? 'X' : 'T';
    }

    calculatePerformanceGap(performance = this.performance) {
        const accuracies = [];
        
        for (const perf of Object.values(performance)) {
            if (perf.total > 10) {
                accuracies.push(perf.correct / perf.total);
            }
        }
        
        if (accuracies.length < 2) return 0;
        
        const max = Math.max(...accuracies);
        const min = Math.min(...accuracies);
        
        return (max - min) / max;
    }

    measureWeightImbalance(weights = this.weights) {
        const values = Object.values(weights);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
        
        return Math.sqrt(variance) / mean;
    }

    measurePerformanceImbalance() {
        const performances = this.calculateDetailedPerformance();
        const accuracies = Object.values(performances)
            .map(p => p.accuracy)
            .filter(a => a > 0);
        
        if (accuracies.length < 2) return 0;
        
        const max = Math.max(...accuracies);
        const min = Math.min(...accuracies);
        
        return (max - min) / max;
    }

    calculateAveragePerformance() {
        let total = 0;
        let count = 0;
        
        for (const perf of Object.values(this.performance)) {
            if (perf.total > 0) {
                total += perf.correct / perf.total;
                count++;
            }
        }
        
        return count > 0 ? total / count : 0.5;
    }

    calculateMarketBias() {
        if (this.history.length < 20) return 0.5;
        
        const recent = this.history.slice(-20);
        const tCount = recent.filter(x => x === 'T').length;
        
        return tCount / 20;
    }

    getMethodWeight(methodName) {
        // Default weights for different methods
        const weights = {
            'Simple Break': 0.8,
            'Trend Break': 0.9,
            'Markov': 0.7,
            'Pattern': 0.85,
            'Momentum': 0.75,
            'Volatility': 0.7,
            'Machine Learning': 0.6
        };
        
        return weights[methodName] || 0.5;
    }

    getTopPerformingModels(limit = 5) {
        const performance = this.calculateDetailedPerformance();
        const models = [];
        
        for (const [name, perf] of Object.entries(performance)) {
            if (name.startsWith('model') && !name.includes('Mini') && !name.includes('Support')) {
                models.push({
                    name,
                    performance: perf.accuracy * perf.consistency,
                    accuracy: perf.accuracy,
                    consistency: perf.consistency
                });
            }
        }
        
        return models.sort((a, b) => b.performance - a.performance).slice(0, limit);
    }

    // Advanced algorithm stubs (would be implemented with actual algorithms)
    fibonacciPattern(data) { return []; }
    harmonicPattern(data) { return []; }
    geometricPattern(data) { return []; }
    waveletAnalysis(data) { return {}; }
    markovChain(data) { return 0.5; }
    bayesianInference(data) { return 0.5; }
    neuralNetwork(data) { return 0.5; }
    geneticAlgorithm(data) { return {}; }
    fuzzyLogic(data) { return 0.5; }
    ensembleLearning(data) { return {}; }
    
    calculateMarkovBreakProb(data) { return 0.5; }
    calculateBayesianBreakProb(data) { return 0.5; }
    calculateMachineLearningBreakProb(data) { return 0.5; }
    calculatePatternBreakProb(data) { return 0.5; }
    calculateMomentumBreakProb(data) { return 0.5; }
    calculateVolatilityBreakProb(data) { return 0.5; }
    calculateMLBreakProb(data) { return 0.5; }
    
    detectFibonacciPatterns(data) { return []; }
    detectHarmonicPatterns(data) { return []; }
    detectGeometricPatterns(data) { return []; }
    detectWavePatterns(data) { return []; }
    detectCyclicPatterns(data) { return []; }
    
    selectBestPattern(patterns) { return patterns[0]; }
    selectBestAdvancedPattern(patterns) { return patterns[0]; }
    selectBestShortPattern(patterns) { return patterns[0]; }
    
    calculatePatternConfidence(pattern) { return pattern.strength || 0.5; }
    calculateImbalanceConfidence(analysis) { return analysis.imbalance * 0.8; }
    
    assessCandleQuality() { return { score: 0.5, level: 'medium' }; }
    adjustForBadCandle() {}
    
    analyzePatternEfficiency() { return {}; }
    getPatternDistribution() { return {}; }
    suggestPatternStrategy() { return {}; }
    calculatePatternCorrelations() { return {}; }
    findOptimalPatterns() { return []; }
    forecastPatternEvolution() { return {}; }
    
    synthesizeTrends(short, medium, long) {
        return {
            prediction: short.direction !== 'neutral' ? short.direction : medium.direction,
            confidence: (short.strength + medium.strength + long.strength) / 3
        };
    }
    
    assessTrendQuality() { return {}; }
    identifyReversalZones() { return []; }
    calculateMomentumIndicators() { return {}; }
    identifyTrendCycles() { return []; }
    projectTrendStrength() { return {}; }
    findOptimalEntryPoints() { return []; }
    
    trackImbalanceHistory() { return []; }
    findOptimalImbalanceThreshold() { return 0.4; }
    calculateMeanReversionStrength() { return 0.5; }
    performRegressionAnalysis() { return {}; }
    identifyConfidenceZones() { return []; }
    calculateAdaptiveThresholds() { return {}; }
    
    calculateMomentumScore() { return 0; }
    detectReversalSignals() { return []; }
    assessPatternContinuity() { return {}; }
    detectMicroPatterns() { return []; }
    optimizeEntryTiming() { return {}; }
    assessShortTermRisk() { return {}; }
    
    getWeightDistribution() { return {}; }
    trackBalanceHistory() { return []; }
    suggestWeightOptimization() { return []; }
    calculateModelCorrelations() { return {}; }
    calculateModelDiversity() { return 0; }
    findOptimalEnsemble() { return {}; }
    
    analyzeBreakHistory() { return {}; }
    findOptimalBreakConditions() { return {}; }
    analyzeRiskReward() { return {}; }
    identifyBreakPatterns() { return []; }
    detectContinuationSignals() { return []; }
    calculateBreakThresholds() { return {}; }
    
    trackWeightEvolution() { return []; }
    analyzeWeightImpact() { return {}; }
    findOptimalWeightPath() { return []; }
    calculateAdaptiveRates() { return {}; }
    measureWeightStability() { return {}; }
    determineRebalancingSchedule() { return {}; }
    
    calculateRandomnessIndicators() { return {}; }
    calculateQualityMetrics() { return {}; }
    suggestAdaptationStrategy() { return {}; }
    assessPatternClarity() { return {}; }
    measureNoiseLevel() { return 0; }
    calculateSignalStrength() { return 0; }
    
    analyzePatternComplexity() { return {}; }
    trackPatternEvolution() { return []; }
    assessPatternReliability() { return {}; }
    identifyPatternClusters() { return []; }
    analyzePatternTransitions() { return {}; }
    trackPatternLifecycle() { return {}; }
    
    analyzeBreakFactors() { return {}; }
    calculateFactorWeights() { return {}; }
    identifyProbabilityZones() { return []; }
    analyzeDetailedBreakHistory() { return {}; }
    calculateConditionalProbabilities() { return {}; }
    runMonteCarloSimulation() { return {}; }
    
    calculateVolatilityIndicators() { return {}; }
    identifyVolatilityCycles() { return []; }
    forecastVolatility() { return 0; }
    analyzeDicePrinciples() { return {}; }
    calculateProbabilityDistribution() { return {}; }
    findStatisticalArbitrage() { return {}; }
    
    getShortPatternLibrary() { return {}; }
    analyzeShortPatternEffectiveness() { return {}; }
    findOptimalShortPatternLength() { return 3; }
    analyzePatternCombinations() { return []; }
    detectRealTimePatterns() { return []; }
    
    rankModels() { return []; }
    analyzePerformanceTrends() { return {}; }
    suggestModelOptimizations() { return {}; }
    recommendWeights() { return {}; }
    suggestEnsembleStrategies() { return {}; }
    
    measureTrendStrength() { return 0; }
    analyzeTrendBreakHistory() { return {}; }
    identifyBreakConditions() { return []; }
    calculateTrendResistance() { return 0; }
    identifyBreakTriggers() { return []; }
    detectConfirmationSignals() { return []; }
    
    analyzeRiskRewardRatio() { return {}; }
    calculateSuccessProbability() { return 0; }
    findOptimalStrategy() { return {}; }
    analyzeScenarios() { return []; }
    runTrendMonteCarlo() { return {}; }
    calculateConfidenceIntervals() { return {}; }
    
    calculateMethodWeights() { return {}; }
    analyzeMethodPerformance() { return {}; }
    findOptimalMethodCombination() { return {}; }
    analyzeMethodConvergence() { return {}; }
    detectDivergenceSignals() { return []; }
    generateEnsemblePredictions() { return []; }
    
    calculateWeightMetrics() { return {}; }
    findWeightOptimizationPath() { return []; }
    analyzeWeightStability() { return {}; }
    measureConvergenceSpeed() { return 0; }
    findOptimalWeightState() { return {}; }
    
    detectMicroTrends() { return []; }
    assessShortTermTrendQuality() { return {}; }
    findShortTermEntryPoints() { return []; }
    detectExitSignals() { return []; }
    
    rankPopularTrends() { return []; }
    analyzeTrendEvolution() { return {}; }
    trackTrendLifecycle() { return {}; }
    analyzeTrendCorrelations() { return {}; }
    measureTrendPredictability() { return 0; }
    analyzeTrendTransitions() { return {}; }
    
    analyzeEnsembleComposition() { return {}; }
    calculateEnsembleMetrics() { return {}; }
    optimizeEnsemble() { return {}; }
    analyzeModelSynergy() { return {}; }
    calculateDiversityMetrics() { return {}; }
    createAdaptiveEnsemble() { return {}; }
    
    calculateGlobalMetrics() { return {}; }
    analyzeBalanceFactors() { return {}; }
    findEquilibriumPoint() { return {}; }
    analyzeSystemicRisks() { return {}; }
    calculateStabilityIndicators() { return {}; }
    findOptimalBalance() { return {}; }
}

// Khởi tạo hệ thống
const predictionSystem = new UltraDicePredictionSystem();

// API endpoint
app.post('/api/dudoan/sunvip', async (req, res) => {
    try {
        // Lấy dữ liệu từ API
        const response = await axios.get('http://160.250.247.18:8001/sunwin/latest/2.0/duyduy221212');
        const data = response.data;
        
        // Chuyển đổi kết quả
        const result = data.ketqua === 'Tài' ? 'T' : 'X';
        
        // Thêm vào lịch sử
        predictionSystem.addResult(result);
        
        // Cập nhật hiệu suất
        predictionSystem.updatePerformance(result);
        
        // Lấy dự đoán
        const prediction = predictionSystem.getFinalPrediction();
        
        // Chuẩn bị response
        const responseData = {
            phien: data.phien + 1,
            Xuc_xac_1: data.xucxac[0],
            Xuc_xac_2: data.xucxac[1],
            Xuc_xac_3: data.xucxac[2],
            Tong: data.tong,
            Ket_qua: data.ketqua,
            du_doan: prediction ? (prediction.prediction === 'T' ? 'Tài' : 'Xỉu') : 'Không xác định',
            do_tin_cay: prediction ? Math.round(prediction.confidence * 100) : 0,
            ly_do: prediction ? prediction.reasons : [],
            thong_ke: {
                tong_phien: predictionSystem.history.length,
                do_bien_dong: Math.round(predictionSystem.sessionStats.volatility * 100),
                entropy: predictionSystem.sessionStats.entropy.toFixed(2),
                trang_thai_thi_truong: predictionSystem.marketState.regime,
                risk_level: predictionSystem.marketState.riskLevel
            }
        };
        
        res.json(responseData);
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).json({ error: 'Không thể lấy dữ liệu' });
    }
});

// API để xem thống kê chi tiết
app.get('/api/stats', (req, res) => {
    res.json({
        history: predictionSystem.history,
        sessionStats: predictionSystem.sessionStats,
        marketState: predictionSystem.marketState,
        modelPerformance: predictionSystem.calculateDetailedPerformance(),
        patternDatabase: Array.from(predictionSystem.patternDatabase.entries())
    });
});

// API để reset hệ thống
app.post('/api/reset', (req, res) => {
    // Reset toàn bộ hệ thống
    Object.assign(predictionSystem, new UltraDicePredictionSystem());
    res.json({ message: 'Hệ thống đã được reset' });
});

// =========================================================
// PHẦN KHỞI ĐỘNG SERVER (THAY THẾ ĐOẠN APP.LISTEN CŨ)
// =========================================================

// 1. Cấu hình để Render và điện thoại truy cập được
const HOST_NAME = '0.0.0.0'; 
const PORT_FINAL = process.env.PORT || 8000;

// 2. Kích hoạt tự động quét dữ liệu game mỗi 20 giây
// Dòng này sẽ gọi hàm autoFetchGame() bạn đã dán ở trên
if (typeof predictionSystem !== 'undefined') {
    setInterval(() => {
        if (typeof predictionSystem.autoFetchGame === 'function') {
            predictionSystem.autoFetchGame();
        }
    }, 20000); // 20 giây quét 1 lần
}

// 3. Chạy Server
app.listen(PORT_FINAL, HOST_NAME, () => {
    console.log(`=========================================`);
    console.log(`🚀 HỆ THỐNG KUBINDEV ĐÃ ONLINE!`);
    console.log(`📡 Port: ${PORT_FINAL}`);
    console.log(`🔗 API chính: https://kubindev-api-vip100-5.onrender.com/api/predict`);
    console.log(`📊 Xem stats: https://kubindev-api-vip100-5.onrender.com/api/stats`);
    console.log(`=========================================`);
});
