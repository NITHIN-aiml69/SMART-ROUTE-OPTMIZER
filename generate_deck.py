#!/usr/bin/env python3
"""
Generate Executive PowerPoint Presentation for Smart Urban Multi-Modal Route & Infrastructure Optimizer
Includes live deployment URL: https://smartrouteoptimizerr.vercel.app/
"""
import os
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# Initialize Presentation with 16:9 Widescreen dimensions
prs = pptx.Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

# Professional Cyber Dark Palette
BG_COLOR = RGBColor(11, 19, 43)        # #0B132B Deep Dark Navy
HEADER_LINE = RGBColor(56, 189, 248)    # #38BDF8 Cyan
CARD_BG = RGBColor(18, 29, 56)          # #121D38 Dark Slate Card
CARD_BORDER = RGBColor(41, 62, 107)     # #293E6B Subtle Border
CYAN = RGBColor(56, 189, 248)           # #38BDF8 Electric Cyan
GOLD = RGBColor(245, 158, 11)           # #F59E0B Amber / Cab Yellow
GREEN = RGBColor(34, 197, 94)           # #22C55E Emerald Green
PURPLE = RGBColor(168, 85, 247)         # #A855F7 Purple Accent
TEXT_WHITE = RGBColor(248, 250, 252)    # #F8FAFC
TEXT_MUTED = RGBColor(148, 163, 184)    # #94A3B8
TEXT_BLUE = RGBColor(186, 230, 253)     # #BAE6FD Light Cyan Accent
RED_ACCENT = RGBColor(239, 68, 68)      # #EF4444 Hospital Emergency Red

DEPLOYMENT_URL = "https://smartrouteoptimizerr.vercel.app/"
GITHUB_URL = "https://github.com/NITHIN-aiml69/SMART-ROUTE-OPTMIZER"

def apply_background(slide):
    """Fill slide with deep dark navy background"""
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = BG_COLOR
    bg.line.fill.background()
    return bg

def add_header(slide, title, category="SMART URBAN OPTIMIZER", subtitle=None):
    """Create a unified top header with category pill, bold title, and accent stripe"""
    # Top Accent Stripe
    stripe = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.38), Inches(11.733), Inches(0.04))
    stripe.fill.solid()
    stripe.fill.fore_color.rgb = HEADER_LINE
    stripe.line.fill.background()

    # Category Pill
    pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.52), Inches(3.2), Inches(0.32))
    pill.fill.solid()
    pill.fill.fore_color.rgb = RGBColor(15, 33, 64)
    pill.line.color.rgb = CYAN
    pill.line.width = Pt(1)
    tf_p = pill.text_frame
    tf_p.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf_p.margin_left = tf_p.margin_right = tf_p.margin_top = tf_p.margin_bottom = 0
    p_pill = tf_p.paragraphs[0]
    p_pill.text = f"  ✦ {category.upper()}"
    p_pill.font.size = Pt(10)
    p_pill.font.bold = True
    p_pill.font.color.rgb = CYAN

    # Title Text
    tx_box = slide.shapes.add_textbox(Inches(0.75), Inches(0.88), Inches(11.8), Inches(0.65))
    tf = tx_box.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    p = tf.paragraphs[0]
    p.text = title
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE

    if subtitle:
        p2 = tf.add_paragraph()
        p2.text = subtitle
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(3)

def add_card(slide, left, top, width, height, title=None, border_color=CARD_BORDER, bg_color=CARD_BG, title_color=CYAN):
    """Add a stylized modern card container"""
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    card.line.color.rgb = border_color
    card.line.width = Pt(1.5)

    if title:
        tx_box = slide.shapes.add_textbox(Inches(left + 0.22), Inches(top + 0.16), Inches(width - 0.44), Inches(0.4))
        tf = tx_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = title_color
    return card

def add_bullet_point(tf, prefix, text, size=12, text_color=TEXT_WHITE, prefix_color=CYAN, space_after=8):
    """Add a bullet point with bold colored prefix"""
    p = tf.add_paragraph() if tf.paragraphs and tf.paragraphs[0].text else tf.paragraphs[0]
    p.space_after = Pt(space_after)
    p.line_spacing = 1.15
    run1 = p.add_run()
    run1.text = f"• {prefix}: " if prefix else "• "
    run1.font.bold = True
    run1.font.size = Pt(size)
    run1.font.color.rgb = prefix_color

    run2 = p.add_run()
    run2.text = text
    run2.font.size = Pt(size)
    run2.font.color.rgb = text_color

def add_stat_box(slide, left, top, width, height, value, label, value_color=GOLD):
    """Add a glowing metric KPI stat box"""
    box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
    box.fill.solid()
    box.fill.fore_color.rgb = RGBColor(15, 25, 48)
    box.line.color.rgb = value_color
    box.line.width = Pt(1.5)

    tx = slide.shapes.add_textbox(Inches(left + 0.1), Inches(top + 0.1), Inches(width - 0.2), Inches(height - 0.2))
    tf = tx.text_frame
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    p1 = tf.paragraphs[0]
    p1.alignment = PP_ALIGN.CENTER
    p1.text = value
    p1.font.size = Pt(20)
    p1.font.bold = True
    p1.font.color.rgb = value_color

    p2 = tf.add_paragraph()
    p2.alignment = PP_ALIGN.CENTER
    p2.text = label
    p2.font.size = Pt(10)
    p2.font.color.rgb = TEXT_MUTED
    p2.space_before = Pt(2)


# ==============================================================================
# SLIDE 1: TITLE SLIDE (Cover)
# ==============================================================================
s1 = prs.slides.add_slide(blank_layout)
apply_background(s1)

# Decorative glowing top accent bar
top_bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.0), Inches(0.8), Inches(11.333), Inches(0.08))
top_bar.fill.solid()
top_bar.fill.fore_color.rgb = CYAN
top_bar.line.fill.background()

# Title text box
t_box = s1.shapes.add_textbox(Inches(1.0), Inches(1.1), Inches(11.333), Inches(2.2))
tf1 = t_box.text_frame
tf1.word_wrap = True
tf1.margin_left = tf1.margin_right = tf1.margin_top = tf1.margin_bottom = 0

p_sub = tf1.paragraphs[0]
p_sub.text = "MUNICIPAL OPERATIONS CENTER & SMART CITY SIMULATION"
p_sub.font.size = Pt(13)
p_sub.font.bold = True
p_sub.font.color.rgb = CYAN
p_sub.space_after = Pt(8)

p_title = tf1.add_paragraph()
p_title.text = "Smart Urban Multi-Modal Route & Infrastructure Optimizer"
p_title.font.size = Pt(32)
p_title.font.bold = True
p_title.font.color.rgb = TEXT_WHITE
p_title.space_after = Pt(10)

p_desc = tf1.add_paragraph()
p_desc.text = "Autonomous Discrete Mathematics Engine, Real-World GIS Road Traversal, Kaveri/BESCOM Utility Optimization & Bengaluru Cab Booking Integration"
p_desc.font.size = Pt(14)
p_desc.font.color.rgb = TEXT_MUTED

# Highlight Card for Live Deployment & GitHub
card_dep = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(3.6), Inches(11.333), Inches(2.3))
card_dep.fill.solid()
card_dep.fill.fore_color.rgb = RGBColor(16, 28, 56)
card_dep.line.color.rgb = GOLD
card_dep.line.width = Pt(2)

tf_dep = card_dep.text_frame
tf_dep.word_wrap = True
tf_dep.margin_left = tf_dep.margin_right = Inches(0.4)
tf_dep.margin_top = Inches(0.25)

p_dep_title = tf_dep.paragraphs[0]
p_dep_title.text = "🚀 LIVE PRODUCTION DEPLOYMENT & OPEN REPOSITORY"
p_dep_title.font.size = Pt(14)
p_dep_title.font.bold = True
p_dep_title.font.color.rgb = GOLD
p_dep_title.space_after = Pt(12)

p_url = tf_dep.add_paragraph()
p_url.space_after = Pt(6)
r_url_tag = p_url.add_run()
r_url_tag.text = "🌐 Live Cloud Application: "
r_url_tag.font.bold = True
r_url_tag.font.size = Pt(15)
r_url_tag.font.color.rgb = CYAN
r_url_link = p_url.add_run()
r_url_link.text = DEPLOYMENT_URL
r_url_link.font.bold = True
r_url_link.font.size = Pt(15)
r_url_link.font.color.rgb = RGBColor(56, 189, 248)
r_url_link.hyperlink.address = DEPLOYMENT_URL

p_git = tf_dep.add_paragraph()
p_git.space_after = Pt(6)
r_git_tag = p_git.add_run()
r_git_tag.text = "💻 GitHub Source Code:   "
r_git_tag.font.bold = True
r_git_tag.font.size = Pt(13)
r_git_tag.font.color.rgb = TEXT_WHITE
r_git_link = p_git.add_run()
r_git_link.text = GITHUB_URL
r_git_link.font.size = Pt(13)
r_git_link.font.color.rgb = TEXT_BLUE
r_git_link.hyperlink.address = GITHUB_URL

p_testbed = tf_dep.add_paragraph()
r_tb_tag = p_testbed.add_run()
r_tb_tag.text = "📍 Geographic Real-World Testbed: "
r_tb_tag.font.bold = True
r_tb_tag.font.size = Pt(12)
r_tb_tag.font.color.rgb = GREEN
r_tb_val = p_testbed.add_run()
r_tb_val.text = "Bengaluru (Bangalore) Real-World GIS Smart Grid · 162 Interconnected Hubs · 4 Metro Lines · 55 Hospitals"
r_tb_val.font.size = Pt(12)
r_tb_val.font.color.rgb = TEXT_WHITE

# 4 Key Pillar Badges across bottom
pillars = [
    ("⚡ Dual-Engine Core", "Flask Backend + Client Math", CYAN),
    ("🛣️ Multi-Modal Dijkstra", "OSRM Roads & Metro Rail", GREEN),
    ("🚕 Cab Booking & Fare Matrix", "Uber, Ola & Namma Yatri", GOLD),
    ("🌲 Utility Infrastructure", "Kruskal & Prim MST (52% Saved)", PURPLE)
]
for i, (p_title, p_subt, p_col) in enumerate(pillars):
    l = 1.0 + i * (11.333 / 4) + (0.08 if i > 0 else 0)
    w = (11.333 / 4) - 0.1
    b = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(l), Inches(6.1), Inches(w), Inches(0.95))
    b.fill.solid()
    b.fill.fore_color.rgb = RGBColor(15, 23, 42)
    b.line.color.rgb = p_col
    b.line.width = Pt(1)
    tf_b = b.text_frame
    tf_b.margin_top = Inches(0.12)
    p_b1 = tf_b.paragraphs[0]
    p_b1.alignment = PP_ALIGN.CENTER
    p_b1.text = p_title
    p_b1.font.bold = True
    p_b1.font.size = Pt(11)
    p_b1.font.color.rgb = p_col
    p_b2 = tf_b.add_paragraph()
    p_b2.alignment = PP_ALIGN.CENTER
    p_b2.text = p_subt
    p_b2.font.size = Pt(9.5)
    p_b2.font.color.rgb = TEXT_MUTED


# ==============================================================================
# SLIDE 2: EXECUTIVE SUMMARY & PROBLEM STATEMENT
# ==============================================================================
s2 = prs.slides.add_slide(blank_layout)
apply_background(s2)
add_header(s2, "Executive Overview: The Twin Urban Dilemma", "PROBLEM STATEMENT & MOTIVATION", "Addressing surface traffic gridlock and subsurface utility capital waste in modern megacities.")

# Left Card: The Problem
add_card(s2, 0.8, 1.8, 5.7, 4.3, "🚨 The Dual Urban Crisis in Megacities", RED_ACCENT)
tx_p2_l = s2.shapes.add_textbox(Inches(1.05), Inches(2.4), Inches(5.2), Inches(3.5))
tf_p2_l = tx_p2_l.text_frame
tf_p2_l.word_wrap = True
add_bullet_point(tf_p2_l, "Surface Mobility Gridlock", "Severe congestion choke points (e.g., Silk Board, Outer Ring Road) cause unpredictable delivery delays, delayed emergency medical response, and elevated PM2.5 emissions.")
add_bullet_point(tf_p2_l, "Monsoon Road Waterlogging", "Heavy rains create severe waterlogging on surface corridors (+45% travel delay), severely impairing road-only fleets.")
add_bullet_point(tf_p2_l, "Subsurface Utility Capital Waste", "Uncoordinated laying of optical fiber cables, Kaveri water pipelines, and BESCOM power grids creates costly redundant loops and endless road digging.")
add_bullet_point(tf_p2_l, "Fragmented Transit & Booking", "Commuters lack unified visibility across road driving, rapid metro rail, and direct cab-hailing fare estimates.")

# Right Card: The Solution
add_card(s2, 6.8, 1.8, 5.7, 4.3, "💡 The Smart Urban Optimizer Solution", GREEN)
tx_p2_r = s2.shapes.add_textbox(Inches(7.05), Inches(2.4), Inches(5.2), Inches(3.5))
tf_p2_r = tx_p2_r.text_frame
tf_p2_r.word_wrap = True
add_bullet_point(tf_p2_r, "Continuous 3-Phase Pipeline", "A mathematically proven engineering pipeline spanning topological validation, dual-engine routing/MST, and operational sign-off.")
add_bullet_point(tf_p2_r, "Multi-Modal Dijkstra Routing", "Intelligently balances real-world OSRM road coordinates with traffic, weather, AQI, and Namma Metro rail networks.")
add_bullet_point(tf_p2_r, "Bengaluru Cab Booking Integration", "Direct fare calculation for Auto, Uber Go, Premier & Bike Taxi with 1-click booking intents and driver simulation.")
add_bullet_point(tf_p2_r, "52.4% Utility Capital Savings", "DSU Kruskal and Prim Minimum Spanning Trees eliminate redundant loops while preserving 100% municipal connectivity.")

# 3 Bottom KPI boxes
add_stat_box(s2, 0.8, 6.25, 3.6, 0.95, "52.4% Capital Saved", "MST Subsurface Loop Elimination", GREEN)
add_stat_box(s2, 4.86, 6.25, 3.6, 0.95, "162 GIS Hubs", "Namma Metro + 55 Hospitals", CYAN)
add_stat_box(s2, 8.93, 6.25, 3.6, 0.95, "0% Deadheading", "Hierholzer Sweeper Circuit", GOLD)


# ==============================================================================
# SLIDE 3: 3-PHASE CONTINUOUS OPTIMIZATION PIPELINE
# ==============================================================================
s3 = prs.slides.add_slide(blank_layout)
apply_background(s3)
add_header(s3, "System Architecture: 3-Phase Continuous Pipeline", "SYSTEM ARCHITECTURE", "Structured algorithmic pipeline from graph topology validation to municipal operational audit.")

phases = [
    ("PHASE 1", "Structural & Topological Validation", CYAN, [
        ("Euler's Handshaking Theorem", "Guarantees ∑ deg(v) = 2|E| and proves the parity of odd vertices is even."),
        ("Connectivity & Disaster Resilience", "BFS discovery of connected components, bridges, and articulation bottlenecks."),
        ("Planarity Audit & Euler's Formula", "V - E + F = 2 verifies 2D surface feasibility and catches K3,3 utility clashes.")
    ]),
    ("PHASE 2", "Dual-Module Optimization Engine", GOLD, [
        ("Subsystem A: Traffic & Cab Routing", "Multi-Modal Dijkstra, OSRM road geometry, AQI clean air, and 1-click cab booking."),
        ("Subsystem B: Subsurface Utility MST", "Kruskal's (DSU) & Prim's algorithms eliminate redundant water/fiber loops."),
        ("Subsystem C: Municipal Logistics", "Hierholzer Euler sweeps (0% deadhead) & Backtracking Hamiltonian security patrols.")
    ]),
    ("PHASE 3", "Operational Audit & System Sign-Off", GREEN, [
        ("Real-World GIS Visualizer", "Leaflet OpenStreetMap, Google Maps with Live TrafficLayer, and Canvas mode."),
        ("Real-Time Telemetry Streaming", "Live operational event logging for dispatches, routing, and MST cost audits."),
        ("Vercel Cloud Deployment", "Live at smartrouteoptimizerr.vercel.app with dual-engine offline resilience.")
    ])
]

for i, (ph_tag, ph_title, ph_col, items) in enumerate(phases):
    left = 0.8 + i * 4.0
    add_card(s3, left, 1.8, 3.75, 5.3, f"{ph_tag}: {ph_title}", ph_col, title_color=ph_col)
    tx = s3.shapes.add_textbox(Inches(left + 0.18), Inches(2.4), Inches(3.4), Inches(4.5))
    tf = tx.text_frame
    tf.word_wrap = True
    for item_title, item_desc in items:
        add_bullet_point(tf, item_title, item_desc, size=11, space_after=12)


# ==============================================================================
# SLIDE 4: PHASE 1: GRAPH TOPOLOGY & MATHEMATICAL FOUNDATIONS
# ==============================================================================
s4 = prs.slides.add_slide(blank_layout)
apply_background(s4)
add_header(s4, "Phase 1: Structural & Topological Validation", "GRAPH THEORY FOUNDATIONS", "Rigorous mathematical theorems proving structural integrity before optimization.")

# Card 1: Handshaking Theorem
add_card(s4, 0.8, 1.8, 3.75, 5.3, "📐 Euler's Handshaking Theorem", CYAN)
tx4_1 = s4.shapes.add_textbox(Inches(1.0), Inches(2.4), Inches(3.35), Inches(4.5))
tf4_1 = tx4_1.text_frame
tf4_1.word_wrap = True
add_bullet_point(tf4_1, "Fundamental Formulation", "In any undirected multigraph G = (V, E), the sum of all vertex degrees equals twice the corridor count:")
p_eq1 = tf4_1.add_paragraph()
p_eq1.text = "∑_{v ∈ V} deg(v) = 2|E|"
p_eq1.font.bold = True
p_eq1.font.size = Pt(13)
p_eq1.font.color.rgb = GOLD
p_eq1.space_before = Pt(4)
p_eq1.space_after = Pt(8)
add_bullet_point(tf4_1, "Parity Lemma", "Proves that every graph contains an EVEN number of vertices with odd degrees. Essential prerequisite for Eulerian municipal routes.")
add_bullet_point(tf4_1, "Bengaluru GIS Audit", "Verified on 162 nodes and 164 corridors: sum of degrees = 328 == 2(164) = 328. 100% mathematical parity!")

# Card 2: Connectivity & Articulation Points
add_card(s4, 4.8, 1.8, 3.75, 5.3, "🛡️ Network Disaster Resilience", GREEN)
tx4_2 = s4.shapes.add_textbox(Inches(5.0), Inches(2.4), Inches(3.35), Inches(4.5))
tf4_2 = tx4_2.text_frame
tf4_2.word_wrap = True
add_bullet_point(tf4_2, "BFS Connected Components", "Validates that all civic sectors, transit lines, and emergency trauma centers form a single connected component (k = 1).")
add_bullet_point(tf4_2, "Articulation Point Detection", "Identifies critical single-point failure bottlenecks (e.g., Silk Board, Majestic Kempegowda).")
add_bullet_point(tf4_2, "Bridge Corridor Audits", "Flags critical links whose failure would split the city into disconnected sub-islands.")
add_bullet_point(tf4_2, "Disaster Re-Routing", "When simulated incidents block a bridge, the dual-engine dynamically routes along alternate corridors.")

# Card 3: Planarity & Euler's Polyhedral Formula
add_card(s4, 8.8, 1.8, 3.75, 5.3, "🌐 Planarity & Euler's Formula", PURPLE)
tx4_3 = s4.shapes.add_textbox(Inches(9.0), Inches(2.4), Inches(3.35), Inches(4.5))
tf4_3 = tx4_3.text_frame
tf4_3.word_wrap = True
add_bullet_point(tf4_3, "Euler's Polyhedral Formula", "For any connected planar city layout with V vertices, E edges, and F bounded faces:")
p_eq2 = tf4_3.add_paragraph()
p_eq2.text = "V - E + F = 1 + k = 2"
p_eq2.font.bold = True
p_eq2.font.size = Pt(13)
p_eq2.font.color.rgb = GOLD
p_eq2.space_before = Pt(4)
p_eq2.space_after = Pt(8)
add_bullet_point(tf4_3, "Planarity Dilemma", "Validates physical 2D feasibility without costly multi-level overpasses or underpasses.")
add_bullet_point(tf4_3, "Kuratowski K3,3 Clashes", "Detects complete bipartite subgraphs in subsurface utility layouts (Gas, Water, Power) where non-planar crossings require insulated conduit bridges.")


# ==============================================================================
# SLIDE 5: PHASE 2A: MULTI-MODAL ROUTING & ENVIRONMENTAL ENGINE
# ==============================================================================
s5 = prs.slides.add_slide(blank_layout)
apply_background(s5)
add_header(s5, "Phase 2A: Multi-Modal Routing Engine", "MOBILITY & DYNAMIC ROUTING", "Dijkstra's shortest path formulation integrated with real-world road coordinates and live weather/AQI penalties.")

# Left Card: Dijkstra Formula & Environmental Multipliers
add_card(s5, 0.8, 1.8, 5.7, 5.3, "⚡ Dynamic Cost Formulation & Environmental Penalties", CYAN)
tx5_l = s5.shapes.add_textbox(Inches(1.05), Inches(2.4), Inches(5.2), Inches(4.5))
tf5_l = tx5_l.text_frame
tf5_l.word_wrap = True
add_bullet_point(tf5_l, "Cost Function Formulation", "Dynamic edge transit weights are calculated considering distance, speed, congestion, weather, and air quality:")
p_eq_d = tf5_l.add_paragraph()
p_eq_d.text = "Cost(e) = (d_e / v_mode) × T_traffic × W_rain × AQI_penalty"
p_eq_d.font.bold = True
p_eq_d.font.size = Pt(12.5)
p_eq_d.font.color.rgb = GOLD
p_eq_d.space_before = Pt(4)
p_eq_d.space_after = Pt(10)
add_bullet_point(tf5_l, "Peak Congestion Multiplier (T)", "T = 1.0 (free-flow) up to 3.6x at notorious bottlenecks like Silk Board and Hebbal.")
add_bullet_point(tf5_l, "Monsoon Rain Surcharge (W)", "+45% travel delay applied to surface roads due to waterlogging; 0% delay on rapid metro rail.")
add_bullet_point(tf5_l, "AQI Clean Air Routing", "Penalizes high PM2.5 corridors (AQI > 150), guiding cyclists and eco-walkers through green urban corridors.")

# Right Card: Multi-Modal Transit Modes
add_card(s5, 6.8, 1.8, 5.7, 5.3, "🚆 The 4 Integrated Multi-Modal Transit Modes", GREEN)
tx5_r = s5.shapes.add_textbox(Inches(7.05), Inches(2.4), Inches(5.2), Inches(4.5))
tf5_r = tx5_r.text_frame
tf5_r.word_wrap = True
add_bullet_point(tf5_r, "🚗 Car / Cab / Taxi", "High-speed road network routing with live congestion avoidance and integrated Bengaluru cab booking.")
add_bullet_point(tf5_r, "🚑 Emergency Ambulance", "Priority emergency medical green corridor routing to 24x7 trauma facilities with 0.4x siren speed-clearing factor.")
add_bullet_point(tf5_r, "🚶 Eco Walking / Bicycle", "Pedestrian-optimized paths prioritizing lowest PM2.5 air pollution and shaded urban corridors.")
add_bullet_point(tf5_r, "🚇 Metro Rapid Rail", "High-speed rail corridor (Purple, Green, Yellow, Pink Lines) with fixed headways and zero surface congestion delay.")
add_bullet_point(tf5_r, "Real Road OSRM Integration", "Queries OpenStreetMap street geometry to yield realistic turn-by-turn navigation instructions.")


# ==============================================================================
# SLIDE 6: REAL-WORLD GIS TESTBED: BENGALURU SMART GRID
# ==============================================================================
s6 = prs.slides.add_slide(blank_layout)
apply_background(s6)
add_header(s6, "Real-World GIS Testbed: Bengaluru Smart Grid", "GEOGRAPHIC TESTBED", "162 GPS nodes and 164 corridors spanning all 4 Namma Metro lines and 55 empanelled hospitals.")

# Left Card: Metro Lines
add_card(s6, 0.8, 1.8, 5.7, 5.3, "🚇 Namma Metro Rail Network (Full 2026 Grid)", PURPLE)
tx6_l = s6.shapes.add_textbox(Inches(1.05), Inches(2.4), Inches(5.2), Inches(4.5))
tf6_l = tx6_l.text_frame
tf6_l.word_wrap = True
add_bullet_point(tf6_l, "🟣 Purple Line (37 Stations)", "East-West arterial axis connecting Challaghatta ➔ KSR Majestic ➔ MG Road ➔ Indiranagar ➔ KR Puram ➔ Whitefield Kadugodi.")
add_bullet_point(tf6_l, "🟢 Green Line (32 Stations)", "North-South industrial-residential corridor from Madavara (BIEC) ➔ Yeshwanthpur ➔ Majestic ➔ RV Road ➔ Silk Institute.")
add_bullet_point(tf6_l, "🟡 Yellow Line (16 Stations)", "High-tech corridor connecting RV Road ➔ BTM Layout ➔ Silk Board ➔ Electronic City ➔ Bommasandra.")
add_bullet_point(tf6_l, "🔴 Pink Line (18 Stations)", "Kalena Agrahara ➔ Bannerghatta Rd ➔ Dairy Circle ➔ MG Road ➔ Nagawara.")
add_bullet_point(tf6_l, "🔄 Major Multi-Line Interchanges", "Majestic Kempegowda (Purple/Green), RV Road (Green/Yellow), Jayadeva Cardiology (Yellow/Pink), MG Road (Purple/Pink).")

# Right Card: Emergency Hospitals & Geolocation
add_card(s6, 6.8, 1.8, 5.7, 5.3, "🏥 55 Empanelled Emergency Hospitals & Geolocation", RED_ACCENT)
tx6_r = s6.shapes.add_textbox(Inches(7.05), Inches(2.4), Inches(5.2), Inches(4.5))
tf6_r = tx6_r.text_frame
tf6_r.word_wrap = True
add_bullet_point(tf6_r, "Comprehensive Hospital Network", "55 major healthcare and trauma facilities mapped with exact GPS coordinates (Victoria, Manipal, Apollo, Fortis, Narayana Health, Bowring, NIMHANS).")
add_bullet_point(tf6_r, "1-Click Nearest Hospital Dispatch", "Instantly computes fastest ambulance corridor from commuter's live location to the closest 24x7 trauma unit.")
add_bullet_point(tf6_r, "Direct Emergency Dialing", "Displays trauma line numbers (e.g., 080-22977400, 1066) and specialty badges directly on the route card.")
add_bullet_point(tf6_r, "4-Tier Resilient Geolocation", "Combines high-accuracy GPS hardware, continuous watchPosition live tracking, IP geolocation fallback, and manual pinpoint geocoding.")


# ==============================================================================
# SLIDE 7: CAB & RIDE-HAILING BOOKING INTEGRATION
# ==============================================================================
s7 = prs.slides.add_slide(blank_layout)
apply_background(s7)
add_header(s7, "Integrated Cab & Ride-Hailing Booking", "INNOVATIVE FEATURE SPOTLIGHT", "Direct Bengaluru fare calculation, 1-click booking deep links, and live driver dispatch simulation.")

# Left Card: Bengaluru Dynamic Fare Matrix
add_card(s7, 0.8, 1.8, 5.7, 5.3, "🚕 Real-World Bengaluru Fare Calculation Matrix", GOLD)
tx7_l = s7.shapes.add_textbox(Inches(1.05), Inches(2.4), Inches(5.2), Inches(4.5))
tf7_l = tx7_l.text_frame
tf7_l.word_wrap = True
add_bullet_point(tf7_l, "🛺 Namma Yatri / Auto Rickshaw", "Authentic Karnataka Govt Fare: ₹36 base (first 2 km) + ₹15/km + ₹0.50/min waiting. 0% commission direct to driver via Open Mobility ONDC.")
add_bullet_point(tf7_l, "🚗 Uber Go / Ola Mini (Economy AC)", "Base ₹55 + ₹15.50/km + ₹1.50/min × (Traffic ? 1.25 : 1.0) × (Monsoon ? 1.20 : 1.0). High-demand compact hatchback/sedan.")
add_bullet_point(tf7_l, "🚘 Uber Premier / Prime Sedan", "Base ₹90 + ₹19.00/km + ₹2.00/min × Surge. Top-rated drivers and spacious sedans.")
add_bullet_point(tf7_l, "🛵 Rapido / Uber Moto (Bike Taxi)", "Base ₹25 + ₹8.50/km + ₹0.80/min. Fastest traversal through notorious Bengaluru bottlenecks.")
add_bullet_point(tf7_l, "Dynamic Congestion Surge", "Automatically updates surge status: '⚡ Standard Off-Peak', '🔥 1.25x Peak Surge', or '🌧️ 1.45x Peak + Rain Delay'.")

# Right Card: Deep Links & Live Dispatch Simulation
add_card(s7, 6.8, 1.8, 5.7, 5.3, "📲 1-Click Universal Booking & Driver Dispatch Simulator", CYAN)
tx7_r = s7.shapes.add_textbox(Inches(7.05), Inches(2.4), Inches(5.2), Inches(4.5))
tf7_r = tx7_r.text_frame
tf7_r.word_wrap = True
add_bullet_point(tf7_r, "🚕 1-Click Uber Universal Deep Link", "Pre-fills pickup latitude/longitude, dropoff coordinates, and hub nicknames directly into Uber App / Web Rider interface.")
add_bullet_point(tf7_r, "🛺 Namma Yatri & Ola Intents", "Direct 1-click links to Namma Yatri open mobility platform and Ola Cabs with pre-filled route pins.")
add_bullet_point(tf7_r, "🗺️ Google Maps Driving Directions", "Opens native driving directions with turn-by-turn road navigation.")
add_bullet_point(tf7_r, "🚖 Interactive Driver Dispatch Simulator", "Broadcasts to nearby drivers, matches real driver profile (e.g., Ramesh Gowda, KA-04-ME-4821, ⭐ 4.93, OTP: 4921).")
add_bullet_point(tf7_r, "Animated Map Traversal", "Spawns a cab marker (🚕) and drives along high-resolution road coordinates with real-time operations telemetry!")


# ==============================================================================
# SLIDE 8: PHASE 2B: SUBSURFACE UTILITY OPTIMIZATION (MST)
# ==============================================================================
s8 = prs.slides.add_slide(blank_layout)
apply_background(s8)
add_header(s8, "Phase 2B: Utility Infrastructure Optimization", "INFRASTRUCTURE OPTIMIZATION", "Kruskal's and Prim's Minimum Spanning Tree algorithms saving 52.4% capital expenditure.")

# Left Card: MST Algorithms
add_card(s8, 0.8, 1.8, 5.7, 5.3, "🌲 Dual Minimum Spanning Tree Algorithms", PURPLE)
tx8_l = s8.shapes.add_textbox(Inches(1.05), Inches(2.4), Inches(5.2), Inches(4.5))
tf8_l = tx8_l.text_frame
tf8_l.word_wrap = True
add_bullet_point(tf8_l, "Civil Engineering Goal", "Connect all residential, commercial, medical, and municipal sectors with Kaveri water pipelines, fiber cables, and power grids with minimal cost.")
add_bullet_point(tf8_l, "Kruskal's Algorithm (Global Edge Sort)", "Sorts all corridors by weight in O(E log E) time. Uses Disjoint Set Union (DSU) with Path Compression and Union by Rank to greedily pick cheapest non-cycling edges.")
add_bullet_point(tf8_l, "Prim's Algorithm (Root Expansion)", "Grows tree from a specified source (e.g., BWSSB Kaveri Treatment Reservoir) using Priority Queue (Min-Heap) in O(E log V) time.")
add_bullet_point(tf8_l, "Algorithmic Equivalence", "Both algorithms output identical minimum cost ($2.30M), mathematically validating the tree topology.")

# Right Card: Capital Savings & Loop Elimination
add_card(s8, 6.8, 1.8, 5.7, 5.3, "💰 Capital Savings & Civil Engineering Impact", GREEN)
tx8_r = s8.shapes.add_textbox(Inches(7.05), Inches(2.4), Inches(5.2), Inches(4.5))
tf8_r = tx8_r.text_frame
tf8_r.word_wrap = True
add_bullet_point(tf8_r, "Baseline vs. Optimized Cost", "Total baseline grid cost of $4,830,000.00 reduced to $2,300,000.00 in the optimized spanning tree.")
add_bullet_point(tf8_r, "52.4% Capital Expenditure Saved", "Eliminates wasteful duplicate construction without disconnecting a single urban sector.")
add_bullet_point(tf8_r, "7 Redundant Subsurface Loops Removed", "Removes costly cycles that cause electrical interference, water backpressure, and cross-layer utility clashes.")
add_bullet_point(tf8_r, "Bengaluru Kaveri / Power Grid", "Applied to Bangalore Water Supply (BWSSB) and Power Substation (KPTCL/BESCOM) networks, saving $25.1M in capital.")
add_bullet_point(tf8_r, "Glowing Green Tree Overlay", "Displays MST in vibrant glowing green lines on the Leaflet and Google Maps views.")


# ==============================================================================
# SLIDE 9: PHASE 2C: MUNICIPAL LOGISTICS (EULER & HAMILTON)
# ==============================================================================
s9 = prs.slides.add_slide(blank_layout)
apply_background(s9)
add_header(s9, "Phase 2C: Municipal Traversal Operations", "CIVIC LOGISTICS & FLEET SIMULATION", "Hierholzer's Euler circuit and Backtracking Hamiltonian cycles for autonomous sweepers and security patrols.")

# Left Card: Hierholzer's Algorithm
add_card(s9, 0.8, 1.8, 5.7, 5.3, "🚛 Hierholzer's Algorithm: 0% Deadhead Sweeper Route", GOLD)
tx9_l = s9.shapes.add_textbox(Inches(1.05), Inches(2.4), Inches(5.2), Inches(4.5))
tf9_l = tx9_l.text_frame
tf9_l.word_wrap = True
add_bullet_point(tf9_l, "Eulerian Circuit Definition", "A closed traversal that traverses every single street corridor in the municipal grid exactly once and returns to the depot.")
add_bullet_point(tf9_l, "Euler's Parity Theorem", "A connected graph has an Eulerian circuit if and only if EVERY vertex has an EVEN degree: ∀ v ∈ V, deg(v) ≡ 0 (mod 2).")
add_bullet_point(tf9_l, "Hierholzer's Algorithm Execution", "Finds sub-cycles and splices them into a grand master circuit in linear time O(|E|).")
add_bullet_point(tf9_l, "Municipal Economic Impact", "Zero Deadheading! Street sweepers and waste collection trucks clean every street with 0% redundant re-traversal.")
add_bullet_point(tf9_l, "Animated Vehicle Simulation", "Interactive button drives a dedicated sweeper truck (🚛) along the entire continuous circuit.")

# Right Card: Hamiltonian Cycles
add_card(s9, 6.8, 1.8, 5.7, 5.3, "🚓 Hamiltonian Cycle: Executive & Security Patrol Circuit", CYAN)
tx9_r = s9.shapes.add_textbox(Inches(7.05), Inches(2.4), Inches(5.2), Inches(4.5))
tf9_r = tx9_r.text_frame
tf9_r.word_wrap = True
add_bullet_point(tf9_r, "Hamiltonian Cycle Definition", "A closed inspection tour that visits every key urban vertex (intersection, depot, hub) exactly once before returning to base.")
add_bullet_point(tf9_r, "Algorithmic Implementation", "Backtracking search with pruning to discover valid Hamiltonian circuits across complex sector topologies.")
add_bullet_point(tf9_r, "Municipal Surveillance Application", "Optimizes police patrol routes, VIP motorcade security sweeps, and municipal infrastructure inspection rounds.")
add_bullet_point(tf9_r, "Zero Repeated Hubs", "Ensures high-priority security sweeps do not loiter or waste time revisiting previously secured hubs.")
add_bullet_point(tf9_r, "Pulsing Beacon Animation", "Displays an animated police patrol beacon (🚓) traversing the perimeter nodes in real time.")


# ==============================================================================
# SLIDE 10: SYSTEM IMPLEMENTATION & DUAL-ENGINE ARCHITECTURE
# ==============================================================================
s10 = prs.slides.add_slide(blank_layout)
apply_background(s10)
add_header(s10, "Technical Architecture: Dual-Engine Resilience", "SYSTEM IMPLEMENTATION", "Full-stack serverless cloud architecture with zero-dependency client-side offline fallback.")

# 3 Column Cards: Frontend, Backend, Cloud Platform
tech_cards = [
    ("Frontend Layer", "Leaflet · Google Maps · Canvas", CYAN, [
        ("Leaflet.js & CartoDB", "Smooth real-world GIS tiles, GPS polylines, congestion heatmaps, and vehicle animations."),
        ("Google Maps JavaScript API", "Vector roadmaps, satellite imagery, and live google.maps.TrafficLayer congestion data."),
        ("HTML5 Interactive Canvas", "Custom physics-based schematic graph canvas with real-time vertex drag-and-drop."),
        ("Responsive Cyber UI", "Modern CSS3 dark mode with glassmorphism cards and live telemetry log streaming.")
    ]),
    ("Backend API Layer", "Python 3.12 · Flask REST API", GOLD, [
        ("Discrete Math Engine", "Modular Python classes (CityGraph, TopologyAuditor, ShortestPathEngine, UtilityMSTOptimizer)."),
        ("Real Road OSRM Proxy", "Queries OpenStreetMap street routing server to fetch turn-by-turn road geometry."),
        ("Bengaluru Fare Calculator", "Dynamic /api/route/cab_fare endpoint calculating fares across Auto, Uber, and Rapido."),
        ("Comprehensive Testing", "test_engine.py rigorously verifies Handshaking, Dijkstra, MST, and Planarity on every build.")
    ]),
    ("Cloud & Resilience", "Vercel Serverless & Offline Math", GREEN, [
        ("Vercel Serverless Architecture", "Zero-config edge deployment using api/index.py WSGI bridge and vercel.json rewrites."),
        ("Global CDN Static Delivery", "HTML, CSS, and JS served from global edge nodes with instant cold-start load times."),
        ("Dual-Engine Offline Fallback", "Client-side algorithms.js implements the complete math engine in pure JS!"),
        ("100% Offline Capability", "Dijkstra, Kruskal, Prim, and Euler routes work in browser memory even if cloud API is offline.")
    ])
]

for i, (tc_title, tc_sub, tc_col, tc_items) in enumerate(tech_cards):
    left = 0.8 + i * 4.0
    add_card(s10, left, 1.8, 3.75, 5.3, tc_title, tc_col, title_color=tc_col)
    tx = s10.shapes.add_textbox(Inches(left + 0.18), Inches(2.4), Inches(3.4), Inches(4.5))
    tf = tx.text_frame
    tf.word_wrap = True
    for it_title, it_desc in tc_items:
        add_bullet_point(tf, it_title, it_desc, size=11, space_after=10)


# ==============================================================================
# SLIDE 11: LIVE DEMONSTRATION & DEPLOYMENT SHOWCASE
# ==============================================================================
s11 = prs.slides.add_slide(blank_layout)
apply_background(s11)
add_header(s11, "Live Cloud Deployment & Demonstration", "LIVE PRODUCTION SHOWCASE", "Fully operational web application deployed on Vercel with complete real-world capabilities.")

# Huge glowing URL banner
banner = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.733), Inches(1.3))
banner.fill.solid()
banner.fill.fore_color.rgb = RGBColor(16, 32, 64)
banner.line.color.rgb = CYAN
banner.line.width = Pt(2)

tf_ban = banner.text_frame
tf_ban.margin_left = tf_ban.margin_right = Inches(0.4)
tf_ban.margin_top = Inches(0.18)

p_ban_t = tf_ban.paragraphs[0]
p_ban_t.text = "🌐 LIVE PRODUCTION APPLICATION URL"
p_ban_t.font.size = Pt(12)
p_ban_t.font.bold = True
p_ban_t.font.color.rgb = GOLD

p_ban_link = tf_ban.add_paragraph()
r_link = p_ban_link.add_run()
r_link.text = DEPLOYMENT_URL
r_link.font.size = Pt(22)
r_link.font.bold = True
r_link.font.color.rgb = CYAN
r_link.hyperlink.address = DEPLOYMENT_URL

p_ban_gh = tf_ban.add_paragraph()
r_gh = p_ban_gh.add_run()
r_gh.text = f"💻 GitHub Repository: {GITHUB_URL}"
r_gh.font.size = Pt(11)
r_gh.font.color.rgb = TEXT_MUTED
r_gh.hyperlink.address = GITHUB_URL

# 4 Feature Demonstration Cards below
demo_features = [
    ("Phase 2A: Route Planner", "Select Origin & Destination (or click '📍 From My Location'). Choose '🚗 Car / Cab' mode to see live Bengaluru fares and 1-click booking on Uber & Namma Yatri.", GOLD),
    ("🚖 Cab Ride Simulation", "Click 'Simulate Driver Dispatch & Live Ride' to match a real driver (e.g. Ramesh Gowda, KA-04-ME-4821), generate OTP, and animate the cab driving on real roads.", CYAN),
    ("🏥 Emergency Hospital Route", "Click '🏥 Nearest Hospital' in the header to instantly calculate the green corridor to Victoria, Manipal, or Apollo Hospital with emergency trauma contact info.", RED_ACCENT),
    ("🌲 Phase 2B: Utility MST", "Run Kruskal or Prim algorithms to watch redundant loops vanish, saving 52.4% capital expenditure with glowing green spanning tree overlay.", GREEN)
]

for i, (df_title, df_desc, df_col) in enumerate(demo_features):
    left = 0.8 + i * 3.0
    add_card(s11, left, 3.35, 2.75, 3.75, df_title, df_col, title_color=df_col)
    tx = s11.shapes.add_textbox(Inches(left + 0.16), Inches(4.0), Inches(2.4), Inches(2.9))
    tf = tx.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = df_desc
    p.font.size = Pt(11.5)
    p.font.color.rgb = TEXT_WHITE
    p.line_spacing = 1.25


# ==============================================================================
# SLIDE 12: CONCLUSION, IMPACT & FUTURE ROADMAP
# ==============================================================================
s12 = prs.slides.add_slide(blank_layout)
apply_background(s12)
add_header(s12, "Conclusion & Future Scalability", "SUMMARY & HORIZONS", "Empowering sustainable, data-driven municipal governance through applied mathematics.")

# Left Card: Key Project Achievements
add_card(s12, 0.8, 1.8, 5.7, 4.3, "🏆 Core Engineering Accomplishments", GREEN)
tx12_l = s12.shapes.add_textbox(Inches(1.05), Inches(2.4), Inches(5.2), Inches(3.5))
tf12_l = tx12_l.text_frame
tf12_l.word_wrap = True
add_bullet_point(tf12_l, "Mathematical Rigor & Validation", "Proved structural integrity using Euler's Handshaking theorem, BFS connectivity, and planarity checks with 100% automated test coverage.")
add_bullet_point(tf12_l, "52.4% Capital Savings Proven", "Demonstrated millions saved in utility infrastructure capital through Kruskal & Prim MST algorithms.")
add_bullet_point(tf12_l, "Real-World Geographic Deployment", "Modeled 162 hubs of Bengaluru (Namma Metro + 55 hospitals) on authentic street coordinates.")
add_bullet_point(tf12_l, "Integrated Ride-Hailing", "Equipped surface road routing with real-time fare calculations, 1-click deep links, and live dispatch simulation.")

# Right Card: Future Roadmap
add_card(s12, 6.8, 1.8, 5.7, 4.3, "🚀 Future Roadmap & Scaling", CYAN)
tx12_r = s12.shapes.add_textbox(Inches(7.05), Inches(2.4), Inches(5.2), Inches(3.5))
tf12_r = tx12_r.text_frame
tf12_r.word_wrap = True
add_bullet_point(tf12_r, "ONDC Open Mobility Live API", "Integrate live Beckn/ONDC protocols for direct instant driver acceptance and payment settlement.")
add_bullet_point(tf12_r, "Multi-City Expansion", "Scale topology pipelines to Mumbai Suburban Railway, Delhi Metro, and Hyderabad transit networks.")
add_bullet_point(tf12_r, "IoT Flood Sensor Telemetry", "Ingest real-time BBMP monsoon storm drain sensors to dynamically reroute emergency vehicles around active flash floods.")
add_bullet_point(tf12_r, "AI-Driven Predictive Traffic", "Train Graph Neural Networks (GNNs) on historical speed patterns to forecast congestion bottlenecks 60 minutes in advance.")

# Bottom Thank You & Q&A Callout
thank_box = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.25, ), Inches(11.733), Inches(0.95))
thank_box.fill.solid()
thank_box.fill.fore_color.rgb = RGBColor(15, 28, 56)
thank_box.line.color.rgb = GOLD
thank_box.line.width = Pt(1.5)

tf_th = thank_box.text_frame
tf_th.margin_top = Inches(0.12)
p_th = tf_th.paragraphs[0]
p_th.alignment = PP_ALIGN.CENTER
r_th1 = p_th.add_run()
r_th1.text = "Thank You! Questions & Live Demo: "
r_th1.font.bold = True
r_th1.font.size = Pt(15)
r_th1.font.color.rgb = TEXT_WHITE
r_th2 = p_th.add_run()
r_th2.text = DEPLOYMENT_URL
r_th2.font.bold = True
r_th2.font.size = Pt(15)
r_th2.font.color.rgb = CYAN
r_th2.hyperlink.address = DEPLOYMENT_URL

# Save the presentation
output_pptx = "Smart_Urban_Route_Optimizer_Presentation.pptx"
prs.save(output_pptx)
print(f"Presentation successfully created and saved to: {output_pptx}")
