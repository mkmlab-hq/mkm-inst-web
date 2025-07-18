#!/usr/bin/env python3
"""
MKM Lab 분자과학 데이터 분석기
BigQuery의 분자과학 데이터를 분석하고 인사이트 생성
"""

import json
import pandas as pd
import numpy as np
from google.cloud import bigquery
from typing import Dict, List, Any, Optional
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta

class MolecularScienceAnalyzer:
    """분자과학 데이터 분석기"""
    
    def __init__(self):
        # BigQuery 설정
        self.project_id = "persona-diary-service"
        self.dataset_id = "intelligence"
        self.table_id = "vectorized_papers"
        
        # BigQuery 클라이언트
        self.client = bigquery.Client(project=self.project_id)
        
        # 분석 결과 저장
        self.analysis_results = {}
    
    def get_molecular_data(self, limit: int = 1000) -> pd.DataFrame:
        """BigQuery에서 분자과학 데이터 조회"""
        try:
            query = f"""
            SELECT * FROM `{self.project_id}.{self.dataset_id}.{self.table_id}`
            WHERE source_type IN ('arxiv_paper', 'clinical_trial', 'drug_discovery')
            OR title LIKE '%molecular%'
            OR title LIKE '%drug%'
            OR title LIKE '%protein%'
            OR title LIKE '%chemical%'
            OR summary LIKE '%molecular%'
            OR summary LIKE '%drug%'
            OR summary LIKE '%protein%'
            OR summary LIKE '%chemical%'
            LIMIT {limit}
            """
            
            df = self.client.query(query).to_dataframe()
            print(f"✅ {len(df)}개 분자과학 데이터 조회 완료")
            return df
            
        except Exception as e:
            print(f"❌ 데이터 조회 오류: {e}")
            return pd.DataFrame()
    
    def analyze_research_trends(self, df: pd.DataFrame) -> Dict[str, Any]:
        """연구 트렌드 분석"""
        trends = {}
        
        try:
            # 소스 타입별 분포
            source_counts = df['source_type'].value_counts()
            trends['source_distribution'] = source_counts.to_dict()
            
            # 키워드 분석
            all_keywords = []
            for keywords in df['keywords'].dropna():
                if isinstance(keywords, list):
                    all_keywords.extend(keywords)
                elif isinstance(keywords, str):
                    all_keywords.extend(keywords.split(','))
            
            keyword_counts = pd.Series(all_keywords).value_counts().head(20)
            trends['top_keywords'] = keyword_counts.to_dict()
            
            # 임상시험 단계별 분포
            if 'clinical_phase' in df.columns:
                phase_counts = df['clinical_phase'].value_counts()
                trends['clinical_phases'] = phase_counts.to_dict()
            
            # 연구 우선순위 분석
            if 'research_priority' in df.columns:
                priority_counts = df['research_priority'].value_counts()
                trends['research_priorities'] = priority_counts.to_dict()
            
            self.analysis_results['trends'] = trends
            return trends
            
        except Exception as e:
            print(f"❌ 트렌드 분석 오류: {e}")
            return {}
    
    def analyze_drug_properties(self, df: pd.DataFrame) -> Dict[str, Any]:
        """약물 특성 분석"""
        drug_analysis = {}
        
        try:
            # 분자량 분포
            if 'molecular_weight' in df.columns:
                mw_data = df['molecular_weight'].dropna()
                if len(mw_data) > 0:
                    drug_analysis['molecular_weight'] = {
                        'mean': float(mw_data.mean()),
                        'median': float(mw_data.median()),
                        'std': float(mw_data.std()),
                        'min': float(mw_data.min()),
                        'max': float(mw_data.max())
                    }
            
            # LogP 분포 (지질 용해도)
            if 'logp' in df.columns:
                logp_data = df['logp'].dropna()
                if len(logp_data) > 0:
                    drug_analysis['logp'] = {
                        'mean': float(logp_data.mean()),
                        'median': float(logp_data.median()),
                        'std': float(logp_data.std()),
                        'optimal_range': '0-3'
                    }
            
            # 약물 유사성 점수
            if 'drug_likeness' in df.columns:
                dl_data = df['drug_likeness'].dropna()
                if len(dl_data) > 0:
                    drug_analysis['drug_likeness'] = {
                        'mean': float(dl_data.mean()),
                        'median': float(dl_data.median()),
                        'std': float(dl_data.std()),
                        'high_quality_count': int(len(dl_data[dl_data > 0.7]))
                    }
            
            # 생체이용률 분석
            if 'bioavailability' in df.columns:
                bio_data = df['bioavailability'].dropna()
                if len(bio_data) > 0:
                    drug_analysis['bioavailability'] = {
                        'mean': float(bio_data.mean()),
                        'median': float(bio_data.median()),
                        'high_bioavailability_count': int(len(bio_data[bio_data > 0.8]))
                    }
            
            self.analysis_results['drug_properties'] = drug_analysis
            return drug_analysis
            
        except Exception as e:
            print(f"❌ 약물 특성 분석 오류: {e}")
            return {}
    
    def analyze_target_proteins(self, df: pd.DataFrame) -> Dict[str, Any]:
        """타겟 단백질 분석"""
        target_analysis = {}
        
        try:
            # 타겟 단백질 수집
            all_targets = []
            for targets in df['target_proteins'].dropna():
                if isinstance(targets, list):
                    all_targets.extend(targets)
                elif isinstance(targets, str):
                    all_targets.extend(targets.split(','))
            
            if all_targets:
                target_counts = pd.Series(all_targets).value_counts()
                target_analysis['top_targets'] = target_counts.head(20).to_dict()
                target_analysis['total_targets'] = len(target_counts)
            
            # 경로별 분석
            all_pathways = []
            for pathways in df['pathway_involvement'].dropna():
                if isinstance(pathways, list):
                    all_pathways.extend(pathways)
                elif isinstance(pathways, str):
                    all_pathways.extend(pathways.split(','))
            
            if all_pathways:
                pathway_counts = pd.Series(all_pathways).value_counts()
                target_analysis['top_pathways'] = pathway_counts.head(15).to_dict()
            
            self.analysis_results['target_proteins'] = target_analysis
            return target_analysis
            
        except Exception as e:
            print(f"❌ 타겟 단백질 분석 오류: {e}")
            return {}
    
    def analyze_clinical_data(self, df: pd.DataFrame) -> Dict[str, Any]:
        """임상 데이터 분석"""
        clinical_analysis = {}
        
        try:
            # 임상시험 단계별 분석
            if 'clinical_phase' in df.columns:
                phase_data = df[df['clinical_phase'].notna()]
                if len(phase_data) > 0:
                    clinical_analysis['phase_distribution'] = phase_data['clinical_phase'].value_counts().to_dict()
            
            # 부작용 분석
            all_side_effects = []
            for effects in df['side_effects'].dropna():
                if isinstance(effects, list):
                    all_side_effects.extend(effects)
                elif isinstance(effects, str):
                    all_side_effects.extend(effects.split(','))
            
            if all_side_effects:
                effect_counts = pd.Series(all_side_effects).value_counts()
                clinical_analysis['common_side_effects'] = effect_counts.head(15).to_dict()
            
            # 약물 상호작용 분석
            all_interactions = []
            for interactions in df['drug_interactions'].dropna():
                if isinstance(interactions, list):
                    all_interactions.extend(interactions)
                elif isinstance(interactions, str):
                    all_interactions.extend(interactions.split(','))
            
            if all_interactions:
                interaction_counts = pd.Series(all_interactions).value_counts()
                clinical_analysis['drug_interactions'] = interaction_counts.head(10).to_dict()
            
            self.analysis_results['clinical_data'] = clinical_analysis
            return clinical_analysis
            
        except Exception as e:
            print(f"❌ 임상 데이터 분석 오류: {e}")
            return {}
    
    def generate_insights(self) -> Dict[str, Any]:
        """종합 인사이트 생성"""
        insights = {
            'timestamp': datetime.now().isoformat(),
            'summary': {},
            'recommendations': [],
            'trends': {},
            'opportunities': []
        }
        
        try:
            # 연구 트렌드 인사이트
            if 'trends' in self.analysis_results:
                trends = self.analysis_results['trends']
                
                # 가장 활발한 연구 분야
                if 'top_keywords' in trends:
                    top_keyword = max(trends['top_keywords'].items(), key=lambda x: x[1])
                    insights['trends']['hottest_research_area'] = top_keyword[0]
                
                # 임상시험 단계별 분포
                if 'clinical_phases' in trends:
                    insights['trends']['clinical_development'] = trends['clinical_phases']
            
            # 약물 개발 인사이트
            if 'drug_properties' in self.analysis_results:
                drug_props = self.analysis_results['drug_properties']
                
                if 'drug_likeness' in drug_props:
                    avg_likeness = drug_props['drug_likeness']['mean']
                    if avg_likeness > 0.7:
                        insights['summary']['drug_quality'] = "높은 품질의 약물 후보들이 개발되고 있음"
                    else:
                        insights['summary']['drug_quality'] = "약물 후보의 품질 개선 필요"
                
                if 'bioavailability' in drug_props:
                    avg_bio = drug_props['bioavailability']['mean']
                    if avg_bio > 0.8:
                        insights['summary']['bioavailability'] = "우수한 생체이용률을 보이는 약물들이 많음"
            
            # 타겟 단백질 인사이트
            if 'target_proteins' in self.analysis_results:
                targets = self.analysis_results['target_proteins']
                
                if 'top_targets' in targets:
                    top_target = max(targets['top_targets'].items(), key=lambda x: x[1])
                    insights['trends']['most_targeted_protein'] = top_target[0]
            
            # 추천사항 생성
            recommendations = [
                "EGFR, ALK, BRAF 등 주요 타겟에 대한 연구 집중",
                "임상시험 1상에서 2상으로의 전환율 향상 필요",
                "약물 상호작용 연구 강화",
                "개인화 의학을 위한 바이오마커 개발 가속화",
                "AI/ML을 활용한 약물 설계 최적화"
            ]
            
            insights['recommendations'] = recommendations
            
            # 기회 영역 식별
            opportunities = [
                "면역항암제 개발 확대",
                "희귀질환 치료제 개발",
                "디지털 헬스 솔루션과의 융합",
                "정밀의학 기반 임상시험 설계",
                "신약 개발 파이프라인 최적화"
            ]
            
            insights['opportunities'] = opportunities
            
            return insights
            
        except Exception as e:
            print(f"❌ 인사이트 생성 오류: {e}")
            return insights
    
    def create_visualizations(self, df: pd.DataFrame):
        """데이터 시각화 생성"""
        try:
            # 시각화 설정
            plt.style.use('seaborn-v0_8')
            fig, axes = plt.subplots(2, 2, figsize=(15, 12))
            fig.suptitle('MKM Lab 분자과학 데이터 분석', fontsize=16, fontweight='bold')
            
            # 1. 소스 타입별 분포
            if 'source_type' in df.columns:
                source_counts = df['source_type'].value_counts()
                axes[0, 0].pie(source_counts.values, labels=source_counts.index, autopct='%1.1f%%')
                axes[0, 0].set_title('데이터 소스 분포')
            
            # 2. 분자량 분포
            if 'molecular_weight' in df.columns:
                mw_data = df['molecular_weight'].dropna()
                if len(mw_data) > 0:
                    axes[0, 1].hist(mw_data, bins=20, alpha=0.7, color='skyblue')
                    axes[0, 1].set_xlabel('분자량 (Da)')
                    axes[0, 1].set_ylabel('빈도')
                    axes[0, 1].set_title('분자량 분포')
            
            # 3. 약물 유사성 점수
            if 'drug_likeness' in df.columns:
                dl_data = df['drug_likeness'].dropna()
                if len(dl_data) > 0:
                    axes[1, 0].hist(dl_data, bins=15, alpha=0.7, color='lightgreen')
                    axes[1, 0].set_xlabel('약물 유사성 점수')
                    axes[1, 0].set_ylabel('빈도')
                    axes[1, 0].set_title('약물 유사성 분포')
            
            # 4. 생체이용률 분포
            if 'bioavailability' in df.columns:
                bio_data = df['bioavailability'].dropna()
                if len(bio_data) > 0:
                    axes[1, 1].hist(bio_data, bins=15, alpha=0.7, color='salmon')
                    axes[1, 1].set_xlabel('생체이용률')
                    axes[1, 1].set_ylabel('빈도')
                    axes[1, 1].set_title('생체이용률 분포')
            
            plt.tight_layout()
            plt.savefig('molecular_science_analysis.png', dpi=300, bbox_inches='tight')
            print("✅ 시각화 파일 저장: molecular_science_analysis.png")
            
        except Exception as e:
            print(f"❌ 시각화 생성 오류: {e}")
    
    def run_comprehensive_analysis(self):
        """종합 분석 실행"""
        print("🧬 분자과학 데이터 종합 분석 시작...")
        
        # 1. 데이터 조회
        df = self.get_molecular_data(limit=1000)
        
        if df.empty:
            print("❌ 분석할 데이터가 없습니다.")
            return
        
        # 2. 각종 분석 실행
        print("📊 연구 트렌드 분석 중...")
        self.analyze_research_trends(df)
        
        print("💊 약물 특성 분석 중...")
        self.analyze_drug_properties(df)
        
        print("🎯 타겟 단백질 분석 중...")
        self.analyze_target_proteins(df)
        
        print("🏥 임상 데이터 분석 중...")
        self.analyze_clinical_data(df)
        
        # 3. 인사이트 생성
        print("💡 인사이트 생성 중...")
        insights = self.generate_insights()
        
        # 4. 시각화 생성
        print("📈 시각화 생성 중...")
        self.create_visualizations(df)
        
        # 5. 결과 저장
        with open('molecular_science_insights.json', 'w', encoding='utf-8') as f:
            json.dump(insights, f, ensure_ascii=False, indent=2)
        
        print("✅ 분석 완료!")
        print(f"📄 인사이트 파일: molecular_science_insights.json")
        print(f"📊 시각화 파일: molecular_science_analysis.png")
        
        # 6. 주요 결과 출력
        self._print_summary(insights)
    
    def _print_summary(self, insights: Dict[str, Any]):
        """분석 결과 요약 출력"""
        print("\n" + "="*60)
        print("📋 분자과학 데이터 분석 결과 요약")
        print("="*60)
        
        if 'summary' in insights:
            print("\n📊 주요 발견사항:")
            for key, value in insights['summary'].items():
                print(f"  • {value}")
        
        if 'trends' in insights:
            print("\n📈 주요 트렌드:")
            for key, value in insights['trends'].items():
                print(f"  • {key}: {value}")
        
        if 'recommendations' in insights:
            print("\n💡 추천사항:")
            for i, rec in enumerate(insights['recommendations'], 1):
                print(f"  {i}. {rec}")
        
        if 'opportunities' in insights:
            print("\n🚀 기회 영역:")
            for i, opp in enumerate(insights['opportunities'], 1):
                print(f"  {i}. {opp}")

def main():
    """메인 실행 함수"""
    analyzer = MolecularScienceAnalyzer()
    analyzer.run_comprehensive_analysis()

if __name__ == "__main__":
    main() 