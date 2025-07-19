import json
import networkx as nx
import spacy
from collections import defaultdict
import re

class KnowledgeGraphBuilder:
    def __init__(self):
        print(🕸️ 지식 그래프 빌더 초기화...")
        
        # 핵심 엔티티 정의
        self.core_entities = {
            # 생체신호 관련
            "biometric": ["heart_rate", "blood_pressure", "stress_level", "sleep_quality", "energy_level"],
            
            # 심리 상태 관련
            "psychological": ["stress", "anxiety", "depression", "happiness", "mood", "emotion"],
            
            # 건강 행동 관련
            "health_behavior": ["exercise", "meditation", "diet", "sleep", "social_interaction"],
            
            # 환경 요인 관련
            "environmental": ["weather", "temperature", "humidity", "air_quality", "season"],
            
            # 페르소나 관련
            "persona": ["therapeutic", "balanced", "dynamic", "fulfilling", "nurturing"]
        }
        
        # 관계 패턴 정의
        self.relation_patterns = {
            "increases": ["increase", "raise", "elevate", "boost", "enhance"],
            "decreases": ["decrease", "reduce", "lower", "diminish", "suppress"],
            "correlates_with": ["correlate", "associate", "relate", "connect", "link"],
            "causes": ["cause", "lead_to", "result_in", "trigger", "induce"],
            "prevents": ["prevent", "protect", "shield", "guard", "defend"],
            "improves": ["improve", "enhance", "better", "optimize", "strengthen"]
        }
        
        # 그래프 초기화
        self.graph = nx.DiGraph()
        
        print(✅지식 그래프 빌더 준비 완료")
    
    def extract_entities_and_relations(self, text):
        텍스트에서 엔티티와 관계 추출""        entities = []
        relations = []
        
        text_lower = text.lower()
        
        # 엔티티 추출
        for category, entity_list in self.core_entities.items():
            for entity in entity_list:
                if entity in text_lower:
                    entities.append((entity, category))
        
        # 관계 추출
        for relation_type, patterns in self.relation_patterns.items():
            for pattern in patterns:
                if pattern in text_lower:
                    relations.append(relation_type)
                    break
        
        return entities, relations
    
    def build_knowledge_graph(self, classified_data):
        지식 그래프 구축"
        print("🕸️ 지식 그래프 구축 시작...")
        
        # 고품질 데이터만 사용
        high_quality_data = classified_data.get('high_quality', [])
        medium_quality_data = classified_data.get('medium_quality', [])
        
        all_data = high_quality_data + medium_quality_data
        
        entity_count = defaultdict(int)
        relation_count = defaultdict(int)
        
        for item in all_data:
            content = f"{item.get('title', '')} {item.get('content', '')}"
            entities, relations = self.extract_entities_and_relations(content)
            
            # 엔티티 노드 추가
            for entity, category in entities:
                if not self.graph.has_node(entity):
                    self.graph.add_node(entity, category=category, count=0)
                
                self.graph.nodes[entity]['count'] +=1            entity_count[entity] += 1
            
            # 관계 엣지 추가
            for i, entity1 in enumerate(entities):
                for j, entity2 in enumerate(entities):
                    if i != j:
                        for relation in relations:
                            edge_key = (entity1[0], entity2[0], relation)
                            if not self.graph.has_edge(entity1[0], entity2[0], relation):
                                self.graph.add_edge(entity1[0], entity2[0], relation_type=relation, 
                                                  weight=0,
                                                  sources=[])
                            
                            self.graph.edges[entity1[0], entity2[0], relation]['weight'] += 1
                            self.graph.edges[entity1[0], entity2[0], relation]['sources'].append({
                               "title": item.get('title', ''),
                                "source": item.get('source_name', ''),
                              "quality_score": item.get('quality_score', 0)
                            })
                            relation_count[edge_key] += 1    
        print(f"✅ 지식 그래프 구축 완료!)
        print(f"   노드 수: {self.graph.number_of_nodes()})
        print(f"   엣지 수: {self.graph.number_of_edges()}")
        
        return self.graph
    
    def find_related_concepts(self, query_entity, max_depth=2):
        관련 개념 찾기       if not self.graph.has_node(query_entity):
            return []
        
        related = 
        visited = set()
        queue = [(query_entity, 0)]  # (entity, depth)
        
        while queue:
            current_entity, depth = queue.pop(0)
            
            if depth > max_depth or current_entity in visited:
                continue
            
            visited.add(current_entity)
            
            # 이웃 노드 찾기
            neighbors = list(self.graph.neighbors(current_entity))
            for neighbor in neighbors:
                edge_data = self.graph.edges[current_entity, neighbor]
                related.append({
                    "entity": neighbor,
                  "relation": edge_data.get("relation_type", "unknown"),
                "weight": edge_data.get("weight", 0),
                    "depth": depth +1               })
                queue.append((neighbor, depth + 1))
        
        # 가중치순으로 정렬
        related.sort(key=lambda x: x["weight"], reverse=True)
        return related[:10]  # 상위 10개만 반환
    
    def generate_complex_insight(self, user_query, user_data):
        복합적 인사이트 생성"        print(f🧠복합적 인사이트 생성: {user_query}")
        
        # 사용자 데이터에서 엔티티 추출
        user_entities = []
        if 'heart_rate' in user_data:
            user_entities.append(('heart_rate', 'biometric'))
        if 'stress_level' in user_data:
            user_entities.append(('stress_level', 'biometric'))
        if 'sleep_quality' in user_data:
            user_entities.append(('sleep_quality', 'biometric'))
        
        insights = []
        
        for entity, category in user_entities:
            related = self.find_related_concepts(entity)
            
            if related:
                insight = {
                "user_entity": entity,
                   "related_concepts": related,
                    "recommendations":                 }
                
                # 추천 생성
                for rel in related[:3]:  # 상위 3개만
                    if rel["relation"] in ['decreases', 'improves']:
                        insight["recommendations"].append({
                         "action": rel["relation"],
                           "reason": f"{rel['entity']}가 {entity}를 {rel['relation']}",
                           "confidence": rel['weight'] /10.0                   })
                
                insights.append(insight)
        
        return insights
    
    def save_knowledge_graph(self, filename="knowledge_graph.json"):
        지식 그래프 저장"""
        graph_data = {
       "nodes":       "edges":
          "statistics": {
            "total_nodes": self.graph.number_of_nodes(),
            "total_edges": self.graph.number_of_edges(),
                "node_categories": defaultdict(int),
               "relation_types": defaultdict(int)
            }
        }
        
        # 노드 데이터
        for node, data in self.graph.nodes(data=True):
            graph_data["nodes"][node] = {
              "id": node,
              "category": data.get("category", "unknown"),
               "count": data.get("count", 0)    }
            graph_data["statistics"]["node_categories"][data.get("category", "unknown")] +=1        
        # 엣지 데이터
        for source, target, data in self.graph.edges(data=True):
            graph_data["edges"][(source, target, data.get("relation_type", "unknown"))] = {
                "source": source,
                "target": target,
              "relation_type": data.get("relation_type", "unknown"),
                "weight": data.get("weight", 0),
             "source_count": len(data.get("sources", []))
            }
            graph_data["statistics"]["relation_types"][data.get("relation_type", "unknown")] +=1     
        with open(filename, "w", encoding='utf-8') as f:
            json.dump(graph_data, f, ensure_ascii=False, indent=2)
        
        print(f"💾 지식 그래프 저장 완료: {filename}")
        return graph_data

# 사용 예시
if __name__ == "__main__":
    builder = KnowledgeGraphBuilder()
    
    # 샘플 데이터로 테스트
    sample_classified_data = {
        "high_quality": [
           {"title": "Stress and Heart Rate Variability", "content": "Stress increases heart rate and decreases heart rate variability. Meditation reduces stress levels.", "source_name": "pubmed", "quality_score": 0.9},
           {"title": "SleepQuality and Stress", "content": "Poor sleep quality correlates with increased stress levels. Exercise improves sleep quality.", "source_name": "nature", "quality_score": 0.95}
        ]
    }
    
    # 지식 그래프 구축
    graph = builder.build_knowledge_graph(sample_classified_data)
    
    # 관련 개념 찾기
    related = builder.find_related_concepts('stress_level')    print("\n관련 개념:")
    for rel in related:
        print(f"{rel['entity']} ({rel['relation']}), 가중치: {rel['weight']})")
    
    # 복합적 인사이트 생성
    user_data = {'heart_rate':85, 'stress_level': 0.7, 'sleep_quality':0.6}
    insights = builder.generate_complex_insight("스트레스 관리", user_data)
    print("\n복합적 인사이트:")    for insight in insights:
        print(f"  {insight['user_entity']} 관련:")        for rec in insight['recommendations']:
            print(f"    - {rec['action']}: {rec['reason']} (신뢰도: {rec['confidence']:0.2})")
    
    # 그래프 저장
    builder.save_knowledge_graph() 