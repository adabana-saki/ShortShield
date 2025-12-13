# ShortShield

> 숏폼 동영상을 차단하고 집중력을 되찾으세요

[![CI](https://github.com/adalab/shortshield/actions/workflows/ci.yml/badge.svg)](https://github.com/adalab/shortshield/actions/workflows/ci.yml)
[![CodeQL](https://github.com/adalab/shortshield/actions/workflows/codeql.yml/badge.svg)](https://github.com/adalab/shortshield/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

ShortShield는 YouTube Shorts, TikTok, Instagram Reels의 숏폼 동영상 콘텐츠를 차단하여 집중력을 유지하도록 도와주는 브라우저 확장 프로그램입니다.

[English](README.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

## 기능

- **멀티 플랫폼 지원**: YouTube Shorts, TikTok, Instagram Reels의 콘텐츠 차단
- **세밀한 제어**: 플랫폼별로 차단 활성화/비활성화
- **화이트리스트**: 특정 채널, URL 또는 도메인 허용
- **사용자 정의 규칙**: 고급 차단을 위한 CSS 선택자 추가
- **프라이버시 우선**: 모든 데이터는 로컬에 저장, 외부 추적 없음
- **크로스 브라우저**: Chrome 및 Firefox 지원

## 설치

### Chrome 웹 스토어

곧 출시 예정!

### Firefox 부가 기능

곧 출시 예정!

### 수동 설치 (개발용)

1. 저장소 클론:

   ```bash
   git clone https://github.com/adalab/shortshield.git
   cd shortshield
   ```

2. 의존성 설치:

   ```bash
   pnpm install
   ```

3. 확장 프로그램 빌드:

   ```bash
   # Chrome용
   pnpm build:chrome

   # Firefox용
   pnpm build:firefox
   ```

4. 확장 프로그램 로드:
   - **Chrome**: `chrome://extensions/`로 이동, "개발자 모드" 활성화, "압축해제된 확장 프로그램을 로드합니다" 클릭 후 `dist/chrome` 폴더 선택
   - **Firefox**: `about:debugging#/runtime/this-firefox`로 이동, "임시 부가 기능 로드" 클릭 후 `dist/firefox` 폴더의 아무 파일 선택

## 사용법

### 기본 조작

1. 브라우저 도구 모음의 ShortShield 아이콘 클릭
2. 메인 토글로 차단 활성화/비활성화
3. 필요에 따라 개별 플랫폼 전환

### 화이트리스트

1. 확장 프로그램 옵션 열기 (톱니바퀴 아이콘 클릭)
2. 화이트리스트 섹션으로 이동
3. 허용하려는 채널, URL 또는 도메인 추가

### 사용자 정의 규칙

1. 확장 프로그램 옵션 열기
2. 사용자 정의 규칙 섹션으로 이동
3. 차단하려는 요소의 CSS 선택자 추가

## 개발

### 전제 조건

- Node.js 20+
- pnpm 9+

### 명령어

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev

# Chrome용 빌드
pnpm build:chrome

# Firefox용 빌드
pnpm build:firefox

# 모든 브라우저용 빌드
pnpm build:all

# 단위 테스트 실행
pnpm test:unit

# E2E 테스트 실행
pnpm test:e2e

# 린트 실행
pnpm lint

# 타입 검사 실행
pnpm typecheck

# 번역 검사
pnpm i18n:check
```

### 프로젝트 구조

```
shortshield/
├── src/
│   ├── background/     # Service Worker
│   ├── content/        # 콘텐츠 스크립트
│   │   ├── platforms/  # 플랫폼 감지기
│   │   └── actions/    # 차단 액션
│   ├── popup/          # 팝업 UI
│   ├── options/        # 옵션 페이지
│   └── shared/         # 공유 유틸리티
├── public/
│   ├── icons/          # 확장 프로그램 아이콘
│   └── _locales/       # 국제화 메시지
├── tests/
│   ├── unit/           # 단위 테스트
│   ├── integration/    # 통합 테스트
│   └── e2e/            # E2E 테스트
└── docs/               # 문서
```

## 프라이버시

ShortShield는 프라이버시를 염두에 두고 설계되었습니다:

- **데이터 수집 없음**: 사용자 데이터를 수집하지 않습니다
- **외부 요청 없음**: 모든 기능이 오프라인으로 작동합니다
- **로컬 저장소만**: 설정은 브라우저에 로컬로 저장됩니다
- **오픈 소스**: 코드가 하는 일에 대한 완전한 투명성

자세한 내용은 [개인정보 처리방침](docs/PRIVACY_POLICY.md)을 참조하세요.

## 기여

기여를 환영합니다! 자세한 내용은 [기여 가이드](CONTRIBUTING.md)를 참조하세요.

### 번역

ShortShield를 더 많은 언어로 번역하는 것을 도와주세요. 자세한 내용은 [TRANSLATING.md](TRANSLATING.md)를 참조하세요.

## 보안

보안 문제는 [보안 정책](SECURITY.md)을 참조하세요.

## 라이선스

[MIT](LICENSE)

## 감사의 말

- [React](https://react.dev/)로 빌드
- [Vite](https://vitejs.dev/)로 번들링
- [@crxjs/vite-plugin](https://crxjs.dev/)의 확장 프레임워크
