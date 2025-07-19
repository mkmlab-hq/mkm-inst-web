import requests
import json
import time
import re
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import feedparser
import xml.etree.ElementTree as ET

class EnhancedDataCollectors:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    def collect_healthcare_news_enhanced(self):
        """향상된 헬스케어 뉴스 수집"""
        sources = [
            {
                "name": "FierceBiotech",
                "url": "https://www.fiercebiotech.com/",
                "search_url": "https://www.fiercebiotech.com/search?keywords=AI+diagnosis",
                "keywords": ["AI diagnosis", "voice analysis", "facial recognition", "machine learning"]
            },
            {
                "name": "MedCityNews",
                "url": "https://medcitynews.com/",
                "search_url": "https://medcitynews.com/?s=AI+diagnosis",
                "keywords": ["artificial intelligence", "diagnostic tools", "digital health"]
            }
        ]
        
        all_news = []
        
        for source in sources:
            print(f"[향상된 뉴스 수집] {source['name']} 수집 중...")
            
            try:
                # 메인 페이지에서 최신 기사 수집
                response = self.session.get(source['url'], timeout=30)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'html.parser')
                    
                    # 기사 링크 찾기
                    article_links = []
                    
                    # 다양한 선택자로 기사 링크 찾기
                    selectors = [
                        'article a[href*="/"]',
                        '.post-title a',
                        '.entry-title a',
                        'h2 a',
                        'h3 a',
                        '.headline a'
                    ]
                    
                    for selector in selectors:
                        links = soup.select(selector)
                        for link in links[:10]:  # 최대 10개
                            href = link.get('href')
                            if href and not href.startswith('#'):
                                if not href.startswith('http'):
                                    href = urljoin(source['url'], href)
                                article_links.append(href)
                    
                    # 중복 제거
                    article_links = list(set(article_links))
                    
                    # 각 기사 상세 수집
                    for link in article_links[:5]:  # 최대 5개 기사
                        try:
                            article_response = self.session.get(link, timeout=30)
                            if article_response.status_code == 200:
                                article_soup = BeautifulSoup(article_response.content, 'html.parser')
                                
                                # 제목 추출
                                title_selectors = ['h1', '.post-title', '.entry-title', '.headline']
                                title = ""
                                for selector in title_selectors:
                                    title_elem = article_soup.select_one(selector)
                                    if title_elem:
                                        title = title_elem.get_text().strip()
                                        break
                                
                                # 본문 추출
                                content_selectors = ['.post-content', '.entry-content', '.article-content', 'article']
                                content = ""
                                for selector in content_selectors:
                                    content_elem = article_soup.select_one(selector)
                                    if content_elem:
                                        content = content_elem.get_text().strip()
                                        break
                                
                                # 키워드 필터링
                                full_text = (title + " " + content).lower()
                                if any(keyword.lower() in full_text for keyword in source['keywords']):
                                    news_item = {
                                        "source_type": "news",
                                        "source_name": source['name'],
                                        "title": title,
                                        "content": content[:1000],  # 1000자로 제한
                                        "url": link,
                                        "published_date": datetime.now().strftime("%Y-%m-%d"),
                                        "entities": self.extract_entities(content),
                                        "keywords": source['keywords']
                                    }
                                    all_news.append(news_item)
                                    print(f"  → {title[:50]}...")
                        
                        except Exception as e:
                            print(f"    ⚠️ 기사 수집 실패: {e}")
                            continue
                
                print(f"  {source['name']}: {len([n for n in all_news if n['source_name'] == source['name']])}건 수집")
                
            except Exception as e:
                print(f"  ⚠️ {source['name']} 수집 실패: {e}")
        
        return all_news
    
    def collect_clinical_trials_enhanced(self):
        """향상된 임상시험 데이터 수집"""
        keywords = [
            "voice analysis",
            "facial diagnosis", 
            "tongue diagnosis",
            "AI diagnosis",
            "machine learning diagnosis",
            "digital health diagnosis"
        ]
        
        all_trials = []
        
        for keyword in keywords:
            print(f"[향상된 임상시험 수집] 키워드: {keyword}")
            
            try:
                # ClinicalTrials.gov API 호출
                url = "https://clinicaltrials.gov/api/query/study_fields"
                params = {
                    "expr": keyword,
                    "fields": "NCTId,BriefTitle,OfficialTitle,LeadSponsorName,Phase,Status,StartDate,CompletionDate,EnrollmentCount,StudyType,Condition,InterventionType,InterventionName,Description",
                    "min_rnk": 1,
                    "max_rnk": 20,  # 각 키워드당 20개씩
                    "fmt": "json"
                }
                
                response = self.session.get(url, params=params, timeout=30)
                if response.status_code == 200:
                    data = response.json()
                    studies = data.get('StudyFieldsResponse', {}).get('StudyFields', [])
                    
                    for study in studies:
                        # 필수 필드 확인
                        nct_id = study.get('NCTId', [''])[0] if study.get('NCTId') else ''
                        title = study.get('BriefTitle', [''])[0] if study.get('BriefTitle') else ''
                        description = study.get('Description', [''])[0] if study.get('Description') else ''
                        
                        if nct_id and title:  # 필수 필드가 있는 경우만
                            trial_item = {
                                "source_type": "clinical_trial",
                                "source_name": "ClinicalTrials.gov",
                                "nct_id": nct_id,
                                "title": title,
                                "content": description,
                                "phase": study.get('Phase', [''])[0] if study.get('Phase') else '',
                                "status": study.get('Status', [''])[0] if study.get('Status') else '',
                                "sponsor": study.get('LeadSponsorName', [''])[0] if study.get('LeadSponsorName') else '',
                                "start_date": study.get('StartDate', [''])[0] if study.get('StartDate') else '',
                                "completion_date": study.get('CompletionDate', [''])[0] if study.get('CompletionDate') else '',
                                "enrollment": study.get('EnrollmentCount', [''])[0] if study.get('EnrollmentCount') else '',
                                "condition": study.get('Condition', [''])[0] if study.get('Condition') else '',
                                "intervention": study.get('InterventionName', [''])[0] if study.get('InterventionName') else '',
                                "published_date": study.get('StartDate', [''])[0] if study.get('StartDate') else '',
                                "entities": self.extract_entities(description),
                                "keywords": [keyword],
                                "url": f"https://clinicaltrials.gov/ct2/show/{nct_id}"
                            }
                            all_trials.append(trial_item)
                            print(f"  → {title[:50]}... (Phase: {trial_item['phase']})")
                    
                    print(f"  {keyword}: {len([t for t in all_trials if keyword in t['keywords']])}건 수집")
                    
            except Exception as e:
                print(f"  ⚠️ {keyword} 임상시험 수집 실패: {e}")
        
        return all_trials
    
    def collect_github_projects(self):
        """GitHub 오픈소스 프로젝트 수집"""
        keywords = [
            "voice analysis",
            "facial recognition",
            "tongue diagnosis",
            "AI diagnosis",
            "medical AI",
            "healthcare AI"
        ]
        
        all_projects = []
        
        for keyword in keywords:
            print(f"[GitHub 프로젝트 수집] 키워드: {keyword}")
            
            try:
                # GitHub API 호출 (공개 API 사용)
                url = "https://api.github.com/search/repositories"
                params = {
                    "q": f"{keyword} language:python",
                    "sort": "stars",
                    "order": "desc",
                    "per_page": 10
                }
                
                response = self.session.get(url, params=params, timeout=30)
                if response.status_code == 200:
                    data = response.json()
                    repositories = data.get('items', [])
                    
                    for repo in repositories:
                        project_item = {
                            "source_type": "github",
                            "source_name": "GitHub",
                            "title": repo.get('name', ''),
                            "content": repo.get('description', ''),
                            "url": repo.get('html_url', ''),
                            "published_date": repo.get('created_at', ''),
                            "stars": repo.get('stargazers_count', 0),
                            "forks": repo.get('forks_count', 0),
                            "language": repo.get('language', ''),
                            "entities": self.extract_entities(repo.get('description', '')),
                            "keywords": [keyword],
                            "owner": repo.get('owner', {}).get('login', '')
                        }
                        all_projects.append(project_item)
                        print(f"  → {repo.get('name', '')} (⭐ {repo.get('stargazers_count', 0)})")
                    
                    print(f"  {keyword}: {len([p for p in all_projects if keyword in p['keywords']])}건 수집")
                    
            except Exception as e:
                print(f"  ⚠️ {keyword} GitHub 수집 실패: {e}")
        
        return all_projects
    
    def collect_research_papers_enhanced(self):
        """향상된 연구 논문 수집 (arXiv, PubMed 등)"""
        keywords = [
            "voice analysis health",
            "facial diagnosis AI",
            "tongue diagnosis deep learning",
            "multimodal medical diagnosis"
        ]
        
        all_papers = []
        
        for keyword in keywords:
            print(f"[향상된 논문 수집] 키워드: {keyword}")
            
            try:
                # arXiv API 호출
                url = "http://export.arxiv.org/api/query"
                params = {
                    "search_query": f"all:{keyword}",
                    "start": 0,
                    "max_results": 10,
                    "sortBy": "submittedDate",
                    "sortOrder": "descending"
                }
                
                response = self.session.get(url, params=params, timeout=30)
                if response.status_code == 200:
                    # XML 파싱
                    root = ET.fromstring(response.content)
                    
                    for entry in root.findall('.//{http://www.w3.org/2005/Atom}entry'):
                        title_elem = entry.find('.//{http://www.w3.org/2005/Atom}title')
                        summary_elem = entry.find('.//{http://www.w3.org/2005/Atom}summary')
                        published_elem = entry.find('.//{http://www.w3.org/2005/Atom}published')
                        id_elem = entry.find('.//{http://www.w3.org/2005/Atom}id')
                        
                        if title_elem is not None and summary_elem is not None:
                            paper_item = {
                                "source_type": "research_paper",
                                "source_name": "arXiv",
                                "title": title_elem.text.strip(),
                                "content": summary_elem.text.strip(),
                                "url": id_elem.text if id_elem is not None else "",
                                "published_date": published_elem.text[:10] if published_elem is not None else "",
                                "entities": self.extract_entities(summary_elem.text),
                                "keywords": [keyword],
                                "arxiv_id": id_elem.text.split('/')[-1] if id_elem is not None else ""
                            }
                            all_papers.append(paper_item)
                            print(f"  → {title_elem.text[:50]}...")
                    
                    print(f"  {keyword}: {len([p for p in all_papers if keyword in p['keywords']])}건 수집")
                    
            except Exception as e:
                print(f"  ⚠️ {keyword} 논문 수집 실패: {e}")
        
        return all_papers
    
    def extract_entities(self, text):
        """텍스트에서 주요 엔티티 추출"""
        if not text:
            return []
        
        entities = []
        
        # 기업명 패턴
        company_pattern = r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Inc|Corp|LLC|Ltd|Company|Technologies|Systems|Solutions|AI|Health|Medical)\b'
        companies = re.findall(company_pattern, text)
        entities.extend(companies)
        
        # 기술명 패턴
        tech_pattern = r'\b(?:AI|ML|Deep Learning|Machine Learning|Neural Network|Computer Vision|NLP|Voice Analysis|Facial Recognition|Natural Language Processing|Computer Vision|Image Processing)\b'
        tech_terms = re.findall(tech_pattern, text, re.IGNORECASE)
        entities.extend(tech_terms)
        
        # 기관명 패턴
        org_pattern = r'\b(?:FDA|NIH|WHO|CDC|Stanford|MIT|Harvard|Google|Microsoft|Apple|Amazon|OpenAI|DeepMind|IBM|Intel)\b'
        orgs = re.findall(org_pattern, text, re.IGNORECASE)
        entities.extend(orgs)
        
        # 의학 용어 패턴
        medical_pattern = r'\b(?:Diagnosis|Treatment|Clinical|Medical|Healthcare|Patient|Disease|Symptom|Therapy|Medicine|Traditional|TCM|Acupuncture|Herbal)\b'
        medical_terms = re.findall(medical_pattern, text, re.IGNORECASE)
        entities.extend(medical_terms)
        
        return list(set(entities))  # 중복 제거

if __name__ == "__main__":
    collectors = EnhancedDataCollectors()
    
    print("🚀 향상된 데이터 수집기 테스트")
    print("=" * 50)
    
    # 1. 헬스케어 뉴스 수집
    print("\n📰 헬스케어 뉴스 수집 테스트")
    news_data = collectors.collect_healthcare_news_enhanced()
    print(f"   → 총 {len(news_data)}건의 뉴스 수집 완료")
    
    # 2. 임상시험 데이터 수집
    print("\n🏥 임상시험 데이터 수집 테스트")
    trial_data = collectors.collect_clinical_trials_enhanced()
    print(f"   → 총 {len(trial_data)}건의 임상시험 수집 완료")
    
    # 3. GitHub 프로젝트 수집
    print("\n💻 GitHub 프로젝트 수집 테스트")
    github_data = collectors.collect_github_projects()
    print(f"   → 총 {len(github_data)}건의 GitHub 프로젝트 수집 완료")
    
    # 4. 연구 논문 수집
    print("\n📚 연구 논문 수집 테스트")
    paper_data = collectors.collect_research_papers_enhanced()
    print(f"   → 총 {len(paper_data)}건의 연구 논문 수집 완료")
    
    # 결과 저장
    all_data = {
        "news": news_data,
        "clinical_trials": trial_data,
        "github_projects": github_data,
        "research_papers": paper_data
    }
    
    with open("enhanced_collected_data.json", "w", encoding="utf-8") as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
    
    total_items = sum(len(items) for items in all_data.values())
    print(f"\n✅ 향상된 데이터 수집 완료!")
    print(f"   총 수집된 데이터: {total_items}건")
    print(f"   저장 파일: enhanced_collected_data.json") 