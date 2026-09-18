#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
按 LeetCode 题号重新排序 Blind 75 Markdown 题解。

用法：
    # 不带参数：自动覆盖 content/posts/Blind 75.md
    python assets/script/sort_blind75.py

    # 传一个参数：原地覆盖指定文件
    python assets/script/sort_blind75.py "content/posts/Blind 75.md"

    # 传两个参数：input 和 output
    python assets/script/sort_blind75.py input.md output.md
"""

import re
import sys
from pathlib import Path


# ===================== 路径配置 =====================
def find_project_root(start: Path) -> Path:
    """从 start 向上寻找项目根目录（含 hugo.toml 或 .git）。"""
    for p in [start, *start.parents]:
        if (p / "hugo.toml").exists() or (p / ".git").exists():
            return p
    return start


PROJECT_ROOT = find_project_root(Path(__file__).resolve().parent)
DEFAULT_INPUT = PROJECT_ROOT / "content" / "posts" / "Blind 75.md"


# ===================== 正则 =====================
HEADING_RE = re.compile(r'^##\s+(.*)$')
LEETCODE_RE = re.compile(r'LeetCode\s*(\d+)', re.IGNORECASE)
OLD_NUM_RE = re.compile(r'^\s*\d+\.\s*')
LEETCODE_SUFFIX_RE = re.compile(
    r'\s*[（(]\s*LeetCode\s*\d+\s*[）)]\s*$',
    re.IGNORECASE
)


# ===================== 处理函数 =====================
def split_front_matter(text: str):
    """拆出 Hugo TOML front matter（+++ ... +++）。"""
    lines = text.splitlines(keepends=True)
    if not lines:
        return "", text

    first = lines[0].lstrip('\ufeff').strip()
    if first == '+++':
        for i in range(1, len(lines)):
            if lines[i].strip() == '+++':
                front = ''.join(lines[:i + 1])
                rest = ''.join(lines[i + 1:])
                return front, rest

    return "", text


def find_section_headings(text: str):
    """找到所有二级标题 `## ` 的行号，忽略代码块内部的 ##。"""
    lines = text.splitlines(keepends=True)
    positions = []
    in_code = False
    fence = None

    for idx, line in enumerate(lines):
        stripped = line.lstrip()

        if stripped.startswith('```') or stripped.startswith('~~~'):
            marker = stripped[:3]
            if not in_code:
                in_code = True
                fence = marker
            elif fence == marker:
                in_code = False
                fence = None
            continue

        if not in_code and re.match(r'^##\s+', line):
            positions.append(idx)

    return lines, positions


def parse_sections(rest: str):
    """返回 (前言, section 列表)。"""
    lines, positions = find_section_headings(rest)

    if not positions:
        return rest, []

    intro = ''.join(lines[:positions[0]])
    sections = []

    for i, start in enumerate(positions):
        end = positions[i + 1] if i + 1 < len(positions) else len(lines)
        sections.append(''.join(lines[start:end]))

    return intro, sections


def parse_heading(section: str):
    """从 section 第一行提取 LeetCode 题号、题名。"""
    first_line = section.splitlines()[0]
    m = HEADING_RE.match(first_line)
    if not m:
        return None, None

    heading_text = m.group(1).strip()

    lm = LEETCODE_RE.search(heading_text)
    if not lm:
        return None, None

    num = int(lm.group(1))

    # 去掉旧编号，例如 "1. "
    body = OLD_NUM_RE.sub('', heading_text, count=1).strip()

    # 去掉末尾的 （LeetCode xxx）
    body = LEETCODE_SUFFIX_RE.sub('', body).strip()

    return num, body


def make_heading(new_index: int, body: str, num: int) -> str:
    return f"## {new_index}. {body}（LeetCode {num}）"


def sort_sections(sections):
    """按 LeetCode 题号排序，并重新编号。"""
    parsed = []
    unparsed = []

    for sec in sections:
        num, body = parse_heading(sec)
        if num is None:
            unparsed.append(sec)
        else:
            parsed.append((num, body, sec))

    parsed.sort(key=lambda x: x[0])

    result = []
    for new_index, (num, body, sec) in enumerate(parsed, start=1):
        lines = sec.splitlines(keepends=True)
        new_heading = make_heading(new_index, body, num) + '\n'
        new_sec = new_heading + ''.join(lines[1:])
        result.append(new_sec)

    # 没有识别出 LeetCode 编号的 section 放到最后，保留原样
    result.extend(unparsed)
    return result


def normalize_join(intro: str, sorted_sections):
    """拼接前言和排序后的 section。"""
    parts = []

    if intro.strip():
        parts.append(intro.rstrip() + '\n\n')

    for sec in sorted_sections:
        parts.append(sec.strip() + '\n\n')

    return ''.join(parts).rstrip() + '\n'


# ===================== 入口 =====================
def main():
    if len(sys.argv) == 1:
        # 不带参数：直接覆盖 content/posts/Blind 75.md
        input_path = DEFAULT_INPUT
        output_path = input_path
    elif len(sys.argv) == 2:
        # 只传一个参数：原地覆盖该文件
        input_path = Path(sys.argv[1])
        output_path = input_path
    else:
        # 传两个参数：input 和 output
        input_path = Path(sys.argv[1])
        output_path = Path(sys.argv[2])

    if not input_path.exists():
        print(f"文件不存在: {input_path}")
        sys.exit(1)

    text = input_path.read_text(encoding="utf-8")

    front, rest = split_front_matter(text)
    intro, sections = parse_sections(rest)
    sorted_sections = sort_sections(sections)

    new_rest = normalize_join(intro, sorted_sections)
    output = front + new_rest

    output_path.write_text(output, encoding="utf-8")

    print(f"已写入: {output_path}")
    print(f"共处理 section 数量: {len(sections)}")


if __name__ == "__main__":
    main()