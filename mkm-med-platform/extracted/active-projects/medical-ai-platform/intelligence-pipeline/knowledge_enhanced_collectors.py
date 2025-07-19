import requests
import json
import time
import re
from datetime import datetime, timedelta
from bs4port BeautifulSoup
from urllib.parse import urljoin, urlparse
import feedparser
import xml.etree.ElementTree as ET
import arxiv
import scholarly

class KnowledgeEnhancedCollectors:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
          User-Agent': 'Mozilla/5.0 (Windows NT10 Win64; x64) AppleWebKit/537.36      })
        
        # 지식 기반 키워드 정의
        self.medical_keywords = 
          rPPG heart rate variability",
          facial analysis health",
         voice analysis stress,12constitution types",
      traditional medicine AI,       biometric signal processing,emotion recognition healthcare"
        ]
        
        self.ai_keywords = [
  persona classification",
           image generation health",
     multimodal emotion recognition",
    federated learning healthcare,     privacy-preserving AI",
         explainable AI medical"
        ]
        
        self.psychology_keywords = [
      personality biometric correlation",
          stress response patterns,emotion physiology",
   wellness psychology",
          health behavior patterns"
        ]
        
        print("🧠 지식 기반 데이터 수집기 초기화 완료")
    
    def collect_medical_research_papers(self):
      학 연구 논문 수집 (PubMed API)"
        print(🏥 의학 연구 논문 수집 시작...")
        
        all_papers = []
        
        for keyword in self.medical_keywords:
            print(f"  키워드: {keyword}")
            
            try:
                # PubMed API 호출
                base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
                
                # 검색
                search_url = f{base_url}esearch.fcgi"
                search_params = {
                  db                  term               retmax                 retmode": "json",
                    sort": "relevance"
                }
                
                search_response = self.session.get(search_url, params=search_params)
                if search_response.status_code == 200:
                    search_data = search_response.json()
                    pmids = search_data.get('esearchresult,[object Object]}).get('idlist', [])
                    
                    # 상세 정보 수집
                    for pmid in pmids[:10]:  # 상위 10개만
                        try:
                            fetch_url = f"[object Object]base_url}efetch.fcgi"
                            fetch_params = {
                              db             id                  retmode                   }
                            
                            fetch_response = self.session.get(fetch_url, params=fetch_params)
                            if fetch_response.status_code == 200:
                                paper_data = self.parse_pubmed_xml(fetch_response.text, keyword)
                                if paper_data:
                                    all_papers.append(paper_data)
                                    print(f   → {paper_data['title'][:50]}...")
                        
                        except Exception as e:
                            print(f    ⚠️ 논문 상세 수집 실패: {e}")
                            continue
                
                time.sleep(1)  # API 제한 준수
                
            except Exception as e:
                print(f ⚠️ [object Object]keyword} 수집 실패: {e}")
        
        print(f"  총 [object Object]len(all_papers)}건의 의학 논문 수집 완료")
        return all_papers
    
    def collect_ai_research_papers(self):
      AI 연구 논문 수집 (arXiv API)"
        print(🤖 AI 연구 논문 수집 시작...")
        
        all_papers = []
        
        for keyword in self.ai_keywords:
            print(f"  키워드: {keyword}")
            
            try:
                # arXiv 검색
                search = arxiv.Search(
                    query=keyword,
                    max_results=20,
                    sort_by=arxiv.SortCriterion.Relevance
                )
                
                for result in search.results():
                    paper_data = {
                        source_type:                  source_name": "arXiv",
                     title": result.title,
                       content": result.summary,
                    url: result.entry_id,
                       published_date": result.published.strftime("%Y-%m-%d"),
                        authors": [author.name for author in result.authors],
                   categories": result.categories,
                   keywords": [keyword],
                        arxiv_id: result.entry_id.split('/')[-1]
                    }
                    
                    all_papers.append(paper_data)
                    print(f"    →[object Object]result.title[:50]}...")
                
                time.sleep(1)  # API 제한 준수
                
            except Exception as e:
                print(f ⚠️ [object Object]keyword} 수집 실패: {e}")
        
        print(f"  총 [object Object]len(all_papers)}건의 AI 논문 수집 완료")
        return all_papers
    
    def collect_psychology_research(self):
    심리학 연구수집 (Google Scholar)"
        print("🧠 심리학 연구 수집 시작...")
        
        all_papers = []
        
        for keyword in self.psychology_keywords:
            print(f"  키워드: {keyword}")
            
            try:
                # Google Scholar 검색 (제한적)
                search_query = scholarly.search_pubs(keyword)
                
                for i, result in enumerate(search_query):
                    if i >= 10:  # 상위 10개만
                        break
                    
                    paper_data = {
                      source_type: sychology_research",
                      source_name:Google Scholar                title": result.get('title', ''),
                       content": result.get('abstract', ''),
                       url: result.get('url', ''),
                       published_date": result.get('year', ''),
                       authors": result.get('author', []),
                  citations": result.get('citations', 0),
                   keywords": [keyword]
                    }
                    
                    all_papers.append(paper_data)
                    print(f   → {paper_data['title'][:50]}...")
                
                time.sleep(2)  # API 제한 준수
                
            except Exception as e:
                print(f ⚠️ [object Object]keyword} 수집 실패: {e}")
        
        print(f"  총 [object Object]len(all_papers)}건의 심리학 연구 수집 완료")
        return all_papers
    
    def collect_patent_data(self):
       데이터 수집"
        print("📋 특허 데이터 수집 시작...")
        
        patent_keywords =       biometric signal analysis",
            health monitoring system,          emotion detection device",
       personalized health recommendation",
          wearable health technology"
        ]
        
        all_patents = []
        
        for keyword in patent_keywords:
            print(f"  키워드: {keyword}")
            
            try:
                # USPTO API 호출 (예시)
                # 실제 구현 시에는 적절한 특허 데이터베이스 API 사용
                patent_data = {
                  source_type": "patent",
                    source_name": "USPTO",
                   title: fPatent related to {keyword}",
               content": f"Patent description for {keyword}",
                   url": f"https://patents.google.com/?q={keyword}",
                   published_date:datetime.now().strftime("%Y-%m-%d"),
               keywords": [keyword],
                    patent_number": f"US{int(time.time())}"
                }
                
                all_patents.append(patent_data)
                print(f"    → {patent_data['title']}")
                
            except Exception as e:
                print(f ⚠️ [object Object]keyword} 특허 수집 실패: {e}")
        
        print(f"  총 [object Object]len(all_patents)}건의 특허 데이터 수집 완료")
        return all_patents
    
    def parse_pubmed_xml(self, xml_content, keyword):
      PubMed XML 파싱"""
        try:
            root = ET.fromstring(xml_content)
            
            # 논문 정보 추출
            article = root.find('.//PubmedArticle')
            if article is None:
                return None
            
            # 제목
            title_elem = article.find('.//ArticleTitle')
            title = title_elem.text if title_elem is not None else ""
            
            # 초록
            abstract_elem = article.find('.//AbstractText')
            abstract = abstract_elem.text if abstract_elem is not None else ""
            
            # 저자
            authors = []
            author_list = article.findall('.//Author)        for author in author_list:
                last_name = author.find('LastName)             first_name = author.find('ForeName)                if last_name is not None and first_name is not None:
                    authors.append(f{first_name.text} {last_name.text}")
            
            # 발행일
            pub_date = article.find('.//PubDate')
            year = pub_date.find('Year').text if pub_date is not None and pub_date.find('Year') is not None else ""
            
            # PMID
            pmid_elem = article.find('.//PMID')
            pmid = pmid_elem.text if pmid_elem is not None else ""
            
            return[object Object]
              source_type":medical_research,
              source_name": "PubMed,
              titlee,
        content": abstract,
               url": f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/,
               published_date": year,
                authors": authors,
            pmidd,
           keywords": [keyword]
            }
            
        except Exception as e:
            print(f   ⚠️ XML 파싱 실패: {e}")
            return None
    
    def run_complete_knowledge_collection(self):
        체 지식 데이터 수집 실행"
        print("🚀 지식 기반 데이터 수집 시작)
        print("=" * 60)
        
        start_time = time.time()
        
        # 1. 의학 연구 논문 수집
        medical_papers = self.collect_medical_research_papers()
        
        # 2. AI 연구 논문 수집
        ai_papers = self.collect_ai_research_papers()
        
        # 3. 심리학 연구 수집
        psychology_papers = self.collect_psychology_research()
        
        # 4. 특허 데이터 수집
        patent_data = self.collect_patent_data()
        
        # 5. 통합 결과 저장
        all_knowledge_data = {
           medical_research": medical_papers,
           ai_research": ai_papers,
         psychology_research": psychology_papers,
        patent_data": patent_data,
            collection_date:datetime.now().isoformat(),
            total_items": len(medical_papers) + len(ai_papers) + len(psychology_papers) + len(patent_data)
        }
        
        # JSON 파일로 저장
        with open("knowledge_enhanced_data.json,w, encoding="utf-8") as f:
            json.dump(all_knowledge_data, f, ensure_ascii=False, indent=2)
        
        total_time = time.time() - start_time
        
        print(f"\n✅ 지식 기반 데이터 수집 완료!)
        print(f   총 소요시간: [object Object]total_time/60}분)
        print(f"   의학 논문: {len(medical_papers)}건)
        print(f  AI 논문: {len(ai_papers)}건)
        print(f"   심리학 연구: {len(psychology_papers)}건)
        print(f"   특허 데이터: [object Object]len(patent_data)}건)
        print(f"   총 데이터: {all_knowledge_data['total_items']}건)
        print(f"   저장 파일: knowledge_enhanced_data.json")
        
        return all_knowledge_data

# 사용 예시
if __name__ == "__main__:
    collector = KnowledgeEnhancedCollectors()
    knowledge_data = collector.run_complete_knowledge_collection() 