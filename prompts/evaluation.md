# Mini Evaluation Set for Statbase Report Generation

These tasks help evaluate the quality of the report generation agent.  Each task includes a question and criteria.

## 1. 리튬 시장 개요
- **Question**: "리튬 시장의 최근 동향과 전망을 알려줘"
- **Expected**: The report should cover global lithium production and demand over the last year, price trends, major producers, and applications in EV and ESS.  Include charts of lithium carbonate price vs EV sales.

## 2. 애플 vs 금 비교
- **Question**: "애플과 금의 가격 움직임을 비교해줘"
- **Expected**: The report compares AAPL stock closing prices and gold spot prices over a defined period (default last 365 days).  It should discuss volatility, correlation, and highlight events like earnings releases or macro shocks.

## 3. 나스닥, 유가, 금 조합
- **Question**: "나스닥, 유가, 금을 조합한 커스텀 인덱스에 대해 분석해줘"
- **Expected**: The report should describe how to combine these assets (equal weighting by default), show the constructed index’s performance, and compare it to each underlying asset.  Include commentary on diversification benefits and risk.