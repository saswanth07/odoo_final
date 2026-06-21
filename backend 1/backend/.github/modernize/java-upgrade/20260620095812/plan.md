# Upgrade Plan: PS2 Cafe Backend (20260620095812)

- **Generated**: 2026-06-20 09:58:12
- **HEAD Branch**: N/A
- **HEAD Commit ID**: N/A

## Available Tools

**JDKs**
- JDK 26.0.1: C:\Program Files\Java\jdk-26.0.1\bin (available and will be used for Java 21 target)
- JDK 17: not available (baseline verification will be skipped)

**Build Tools**
- Maven 3.9.16: C:\maven\apache-maven-3.9.16\bin
- Maven Wrapper: 3.9.16 (present and compatible with Java 21)

## Guidelines

- Upgrade the project runtime from Java 17 to Java 21 LTS.
- Preserve the existing Spring Boot 3.5.15 setup and avoid unnecessary dependency changes.

> Note: You can add any specific guidelines or constraints for the upgrade process here if needed, bullet points are preferred.

## Options

- Working branch: appmod/java-upgrade-20260620095812
- Run tests before and after the upgrade: true

## Upgrade Goals

- Java 21

## Technology Stack

| Technology/Dependency | Current | Min Compatible | Why Incompatible |
| --------------------- | ------- | -------------- | ---------------- |
| Java | 17 | 21 | User requested upgrade to latest LTS runtime |
| Spring Boot | 3.5.15 | 3.5.15 | Current Spring Boot is already compatible with Java 21 |
| Maven Wrapper | 3.9.16 | 3.9.0 | Compatible with Java 21 and current build environment |
| maven-compiler-plugin | managed by Spring Boot parent | 3.11.0 | Recommended for Java 21 support, managed by current parent version |

## Derived Upgrades

- Java 21 target requires updating the Maven project `java.version` property from 17 to 21.
- No Spring Boot version upgrade is required because Spring Boot 3.5.15 supports Java 21.
- No additional dependency version upgrades are required solely for the runtime bump.

## Impact Analysis

### Dependency Changes

| File | Dependency | Current | Action | Target | Reason |
|------|------------|---------|--------|--------|--------|
| pom.xml | `<java.version>` | 17 | upgrade | 21 | User requested runtime upgrade to Java 21 |

### Source Code Changes

| File | Location | Current | Required Change | Reason |
|------|----------|---------|----------------|--------|
| None | N/A | N/A | No source code changes required for the runtime upgrade | Upgrade is handled by build configuration |

### Configuration Changes

No application configuration changes are required for this Java runtime upgrade.

### CI/CD Changes

No CI/CD or container configuration changes are identified in the repository for this upgrade.

### Risks & Warnings

- **Baseline unavailable**: JDK 17 is not installed on the host, so baseline compilation and test pass rate cannot be verified. Mitigation: proceed with target validation on available Java 26 and document the missing baseline.
- **Compile/runtime gap**: Using JDK 26 to build for Java 21 is acceptable, but final validation must run full tests on the target runtime settings to confirm no Java 21-specific incompatibilities.

## Upgrade Steps

- Step 1: Setup Environment
  - **Rationale**: Confirm the available Java and Maven tools before making build changes. Ensure the upgrade environment is ready and compatible.
  - **Changes to Make**: None in source or pom yet; verify JDK 26 and Maven wrapper availability.
  - **Verification**: `.\mvnw.cmd -q -version` | JDK: C:\Program Files\Java\jdk-26.0.1\bin | Expected: SUCCESS

- Step 2: Baseline Verification
  - **Rationale**: Establish current build/test behavior before upgrading, but skip because JDK 17 is unavailable on this host.
  - **Changes to Make**: None.
  - **Verification**: skipped

- Step 3: Upgrade Java runtime to 21
  - **Rationale**: Apply the requested runtime upgrade at the build configuration level while preserving current dependency versions.
  - **Changes to Make**: Update `pom.xml` `<java.version>` from 17 to 21.
  - **Verification**: `.\mvnw.cmd -q clean test-compile` | JDK: C:\Program Files\Java\jdk-26.0.1\bin | Expected: SUCCESS

- Step 4: CVE Validation & Fix
  - **Rationale**: Scan direct dependencies after the upgrade and resolve any known vulnerabilities before final validation.
  - **Changes to Make**: Run dependency scan and update direct dependency versions if CVEs are reported.
  - **Verification**: `.\mvnw.cmd -q dependency:list -DexcludeTransitive=true` plus `#appmod-validate-cves-for-java` report; follow-up `.\mvnw.cmd -q clean test-compile`

- Step 5: Final Validation
  - **Rationale**: Confirm the upgraded runtime and configuration through a full build and test suite run.
  - **Changes to Make**: None beyond verified upgrade and any CVE fixes.
  - **Verification**: `.\mvnw.cmd -q clean test` | JDK: C:\Program Files\Java\jdk-26.0.1\bin | Expected: SUCCESS
