# Music Video (MV) Production Skill

When the user wants to create a Music Video (MV), follow this workflow **instead of** the default video generation process.

## STEP 0: CHECK RESOURCES

1. **Music file**: If not provided, ask the user to provide one or generate using `hilo_tools_music_generation_with_official` (audio agent).
2. **LRC lyrics**: Ask the user: "Do you have LRC lyrics? If yes, provide them. If not, I'll use audio analysis to extract lyrics."
3. **MV duration**: If user specifies a duration (e.g. "30 seconds"), call **editing agent** with `hilo_tools_audio_subclip_batch` to trim the audio first.
4. Get audio duration via **editing agent** using `hilo_tools_audio_meta`.

## STEP 0.5: ANALYZE MUSIC (DIRECT — do NOT delegate to sub-agent)

**IMPORTANT**: `hilo_tools_read_media` is YOUR direct tool (orchestrator), NOT a sub-agent tool. Call it directly — do NOT delegate this step to the editing agent or any other sub-agent.

Call `hilo_tools_read_media` with the music file to understand:
- **question**: "Analyze this music track in detail: 1) How many singers? Solo or duet? 2) Gender of each singer (male/female) 3) Music genre and style (pop, rock, ballad, electronic, hip-hop, etc.) 4) Mood and emotion (romantic, energetic, melancholic, etc.) 5) Tempo (slow/medium/fast, approximate BPM) 6) Language of lyrics 7) Any notable instruments or production style 8) Suggested visual aesthetic for an MV (realistic, cyberpunk, fantasy, anime, etc.)"

Use this analysis throughout the workflow:
- **Step 1**: Inform `language` parameter for ASR
- **Step 2**: Guide visual style, character design, and scene choices in the storyboard
- **Step 2**: Determine `is_duet` and `singer_gender` for each lyric segment

## STEP 1: EXTRACT LYRICS WITH TIMESTAMPS

**If user provided LRC lyrics**: Parse them directly into timestamped format.

**If no LRC lyrics**: Call **editing agent** with `hilo_tools_audio_transcribe_lyrics` to run ASR:
- `audio_path`: the music file path
- `total_duration`: from Step 0's `hilo_tools_audio_meta` result
- `language`: "zh" for Chinese, "en" for English, "auto" for auto-detect
- Chinese uses Tencent Cloud ASR, other languages use Whisper ASR
- Returns segments with word-level timestamps, plus [prelude]/[interlude]/[outro] markers
- Result is saved to a JSON file — read it to get the full segment data

Format the extracted lyrics as:
```
[segment_start]lyric_text|singer_gender:male/female/mixed/null
[0.00][prelude]|singer_gender:null
[10.72]First lyric line|singer_gender:female
[14.68]Second lyric line|singer_gender:male
...
[total_duration:XXX.XX]
[is_duet:true/false]
```

## STEP 2: GENERATE MV SCRIPT

As the orchestrator, generate a complete MV storyboard script yourself (this is an LLM task, no sub-agent needed). The script must include:

**Be creative and cinematic** — don't just illustrate the lyrics literally. Use your imagination to create visually compelling scenes that capture the *emotion* of the music:
- Use **metaphorical imagery**: a breakup song doesn't need to show two people arguing — it could show autumn leaves falling, an empty chair, rain on a window
- Create **visual contrast**: alternate between intimate close-ups and grand wide shots, warm and cool tones, stillness and motion
- Design **scene variety**: 4-6 distinct scenes minimum. Don't reuse the same location for every narrative segment — take the viewer on a journey (city streets -> rooftop -> seaside -> forest -> studio)
- Add **cinematic moments**: slow-motion, silhouettes, reflections, light flares, time-lapse transitions
- Match **energy to music**: verse = gentle/intimate scenes, chorus = dramatic/expansive scenes, interlude = atmospheric/abstract visuals

### Visual Style
Based on lyrics mood/genre, choose one: `realistic`, `cyberpunk`, `fantasy`, `cartoon_3d`. Apply consistently to ALL prompts.

### Characters
```json
{
  "character_id": "char_singer_male",
  "name": "Singer Name",
  "image_prompt": "style keywords + ethnicity, appearance, clothing, pose, expression. Simple background.",
  "is_singer": true,
  "singer_gender": "male"
}
```
- MUST include singer character(s): one for solo, two for duet
- Singer character_id format: `char_singer_male` / `char_singer_female`
- Make characters visually attractive and distinctive

### Scenes
```json
{
  "scene_id": "scene_performance",
  "name": "Performance Stage",
  "image_prompt": "Realistic photography, recording studio with warm lighting, clean background. NO people."
}
```
- MUST include `scene_performance` for all performance segments
- NO people in scene images — pure environment only

### Script Segments
```json
{
  "start": 0.0, "end": 10.5,
  "lyrics": "[prelude]",
  "scene_id": "scene_001",
  "characters_in_scene": [],
  "action": "...", "camera": "...", "lighting": "...", "visual_focus": "...",
  "segment_type": "narrative",
  "singer_gender": null
}
```

**Timing rules**:
- Segments MUST be continuous (no gaps)
- First segment starts at 0.0, last ends at total_duration
- Duration: 3-15 seconds (hard limits)
- **Preferred duration: 7-10 seconds per segment**. Fewer, longer segments produce more coherent storytelling — each video clip has enough time to develop a visual narrative. Avoid splitting lyrics into many short 3-4s segments; instead, merge adjacent lyrics into one 7-10s segment whenever possible.
- Performance segments: <= 10 seconds

**Segment types**:
- `narrative`: Storytelling scenes, no lip-sync. Can include characters (walking, playing guitar, gazing into distance, etc.) or pure environment shots. For [prelude], [interlude], [outro], and most lyric segments.
- `performance`: Singer performing directly to camera, lip-sync required. MUST use `scene_performance`. Only for key emotional moments.

**Performance segment selection — vary it**:
- Do NOT only pick choruses for performance. Scatter performance segments **unpredictably** across the song — a quiet verse line sung with intense eye contact can be more impactful than yet another chorus lip-sync.
- Good candidates: opening hook, emotional turning point in a verse, bridge, a single powerful line before the final chorus, the last line of the song.
- Avoid patterns like "every chorus = performance" — this feels repetitive. Mix it up so the viewer is surprised when the singer suddenly looks at them.
- **Never place two performance segments back-to-back** — always separate them with at least one narrative segment. Consecutive lip-sync shots feel jarring and break the visual flow.

**Segment type ratio — IMPORTANT**:
- **~60% narrative, ~40% performance** by total duration. This is validated by `hilo_tools_validate_mv_storyboard` and will FAIL if performance exceeds 50%.
- Do NOT make every lyric segment a performance segment. Most lyric segments should be narrative (storytelling visuals with the lyrics as subtitles).
- [prelude], [interlude], [outro] are always `narrative`.
- A typical 3-minute MV should have ~6-8 performance segments and ~15-18 narrative segments.

### Validate
After generating the script, call **editing agent** with `hilo_tools_validate_mv_storyboard`:
- Pass segments, total_duration, scenes, and characters
- Fix all errors and re-validate until PASSED

## STEP 3: GENERATE IMAGES

Call **image agent** to generate all character and scene images:

1. **Character images**: Use each character's `image_prompt`. Aspect ratio: `16:9`.
2. **Scene images**: Use each scene's `image_prompt`. Aspect ratio: `16:9`.

Include ALL prompts in one task_description to the image agent for batch generation.

**IMPORTANT**: Do NOT specify filenames like "Save as: xxx.png" in the task_description — the image agent will try to rename files which breaks assets.json tracking. Just describe the images by their IDs (e.g. "Image 1 — char_singer_male") and use the returned paths directly.

## STEP 4: CONFIRM IMAGES WITH USER

Present all generated images to the user. Ask if any need adjustments. Regenerate as needed.

## STEP 5: GENERATE VIDEOS

For each script segment, the flow is: **reference images -> image agent generates first frame -> video agent generates video**.

Do NOT use character/scene reference images directly as first_frame_images for video generation! Reference images are portraits/environments — they need to be composited into a proper scene frame first.

**IMPORTANT — Batch first, then batch again**: Call image agent ONCE to batch-generate ALL first frames for ALL segments, then call video agent to batch-generate ALL videos. Do NOT interleave (generate one first frame -> one video -> next first frame -> next video).

### Step 5a: Generate ALL First Frame Images (image agent — one batch call)

Call **image agent** ONCE with ALL segment first frames in one batch:
- For each segment, pass the scene image + character images as reference (`image_paths`)
- Prompt should describe the exact scene composition: character placement, action pose, camera angle, lighting — matching the segment's `action`, `camera`, `lighting`, `visual_focus` fields
- Aspect ratio: `16:9`
- For performance segments: do NOT include microphones in the prompt — they interfere with lip-sync
- **IMPORTANT — Face visibility**: ALL character first frames MUST show the character **facing the camera with a clear, frontal face**. Avoid side profiles, back views, or obscured faces. If the first frame doesn't show the character's real face clearly, Official video generation won't know what the face looks like and will hallucinate a different person's face in the video — destroying character consistency across the MV.

### Step 5b: Generate NARRATIVE Videos (video agent — Official)

After ALL first frames are generated, call video agent to generate videos for **narrative segments only**. Performance segments will be generated separately in Step 5d using Wan I2V with audio sync.

**IMPORTANT — Model selection**: Narrative video generation MUST use `hilo_tools_official_videos_generation` (Official Hilo) at default 768P resolution. Performance videos use Wan I2V. Note that the two models may output different resolutions/FPS — this will be normalized in Step 5e before assembly.

**IMPORTANT — No last_frame_images**: MV segments each have their own unique first frame — do NOT use `last_frame_images` for scene transitions. Explicitly tell the video agent: "Do NOT set last_frame_images, set all to null."

**IMPORTANT — Minimal motion prompts**: Video prompts should describe **subtle, gentle movements** — slight head turns, soft breathing, slow camera pan, gentle wind in hair. Do NOT describe large or fast actions (running, jumping, dramatic gestures, quick camera movement). Large motion causes the character's face to deform or morph during generation, which ruins lip-sync quality and visual consistency. The less the face moves, the better the final result.

**Duration strategy**: Official `duration: 6` actually produces ~5.88s, and `duration: 10` produces ~10.12s. Choose based on segment target duration:
- Segment <= 5.8s -> generate `duration: 6` (actual ~5.88s), then trim
- Segment > 5.8s -> generate `duration: 10` (actual ~10.12s), then trim
- Segment > 10s -> generate `duration: 10`, then **extend** (see Step 5c)

Call video agent ONCE to generate ALL segment videos (narrative + performance together):
- `first_frame_images`: ALL generated **narrative** first frames from Step 5a
- `prompts`: ALL **narrative** video motion descriptions
- `duration`: 6 or 10 per segment based on strategy above

### Step 5c: Adjust NARRATIVE Videos to Exact Segment Duration

**CRITICAL — Duration matching**: Official generates fixed 6s or 10s videos, but segments have varying durations. If not adjusted, the concatenated video will NOT match the audio, causing desync. This step MUST happen BEFORE Step 5d.

Call **editing agent** to adjust EVERY **narrative** video to its exact segment duration (performance videos are handled in Step 5d):

#### Case 1: Video longer than target -> Trim
```bash
ffmpeg -i <video> -t <target_duration> -an <output> -y
```
**Do NOT use `-c:v copy`** — stream copy can only cut at keyframe boundaries (~0.08-0.12s error per clip, accumulates across segments). Re-encoding is slower but gives frame-accurate cuts.

#### Case 2: Video shorter than target (segment > 10s) -> Extend then trim

**This case is NOT optional** — prelude, interlude, outro, and long verse segments commonly exceed 10s. Official max output is ~10s, so these clips WILL be too short. If you skip this, the final MV will be shorter than the audio and `hilo_tools_mv_final_assembly` will reject it.

**How to identify**: any segment where `target_duration > video_actual_duration`. Typical examples:
- Prelude: 13-15s (generated video is ~10s, deficit ~3-5s)
- Interlude: 10-30s (generated video is ~10s, deficit up to 20s)
- Outro: 15-20s (generated video is ~10s, deficit ~5-10s)
- Long verse segments: 11-15s

**How to extend**:

1. **Extract last frame** from the short video:
   ```bash
   ffmpeg -sseof -0.1 -i <video> -vframes 1 -q:v 2 <last_frame.jpg> -y
   ```

2. **Generate extension video** using the last frame as first_frame_image, with a prompt continuing the same scene/action. Choose duration based on how much more is needed:
   - Need <= 5.8s more -> generate `duration: 6`
   - Need > 5.8s more -> generate `duration: 10`
   - Need > 16s more -> repeat this process (chain multiple extensions)

3. **Concatenate** original + extension(s):
   ```bash
   echo "file '<original.mp4>'" > concat.txt
   echo "file '<extension.mp4>'" >> concat.txt
   ffmpeg -f concat -safe 0 -i concat.txt -c copy <joined.mp4> -y
   ```

4. **Trim** the joined result to exact target duration:
   ```bash
   ffmpeg -i <joined.mp4> -t <target_duration> -an <output> -y
   ```

**Batch all Case 2 segments together** — collect all segments that need extension, generate all extension videos in one batch call to the video agent, then concatenate and trim each one. Do not interleave with Case 1 processing.

#### General rules
- Always use `-an` to strip audio (final assembly adds the original music)
- **CRITICAL**: After adjusting all videos, **SUM all clip durations and compare to `total_duration`**. If the drift exceeds 0.5 seconds, `hilo_tools_mv_final_assembly` will **REJECT the assembly with a detailed error**. You MUST fix the short clips before retrying. Common causes: segments > 10s that were not extended (Case 2 above).
- Process ALL segments (narrative + performance) — not just the long ones
- **DO NOT SKIP Case 2 for segments > 10s** — prelude, interlude, outro, and long verse segments all need extension. Skipping this is the #1 cause of lip-sync desync.

### Step 5d: Generate Performance Videos with Audio Sync (Wan I2V)

**Do NOT use the Official + Kling lip-sync pipeline for performance segments.** Instead, use Wan I2V which generates video directly driven by audio — the mouth movements are naturally synced from the start, with no post-processing needed.

**Sub-step 1**: Call **editing agent** with `hilo_tools_audio_subclip_batch` to extract ALL performance audio segments in one batch call.

**Sub-step 2**: Call **video agent** with `hilo_tools_batch_wan_i2v_generation` to generate ALL performance videos in one call (internally limited to 3 concurrent to avoid API rate limits):
- `image_paths`: ALL performance first-frame images from Step 5a
- `audio_paths`: ALL corresponding subclipped audio segments from Sub-step 1
- `prompts`: subtle motion prompts for each — the singer singing with gentle expression changes, soft breathing, slight head movement. **Keep motion minimal** to preserve face consistency.
- `durations`: choose per clip based on audio length — 5 (for audio <= 5s) or 10 (for audio > 5s). Audio must be <= 10s (performance segments are capped at 10s by the storyboard validator).

**Sub-step 3 — Trim to exact duration**: Wan I2V outputs 5s or 10s video, but the performance segment may be e.g. 6.63s. Trim each output to the exact segment duration using ffmpeg:
```bash
ffmpeg -i <wan_output.mp4> -t <target_duration> -an <output> -y
```
The `-an` flag also strips the embedded audio (final assembly will use the original music track).

**Why Wan I2V instead of Official + Kling**: Kling lip-sync frequently fails with "face too large/small" errors and produces unnatural mouth movements. Wan I2V drives video generation directly from audio, producing naturally synced results without any post-processing step.

**Note**: Narrative segments still use Official (Step 5b) — only performance segments use Wan I2V.

### Step 5e: Normalize Clip Specs Before Assembly (MANDATORY)

Before final assembly, use ffprobe to check that ALL clips share the same resolution and FPS. If any mismatch is found (e.g. Wan I2V and Official Hilo clips differ), rescale the outliers to match the majority using ffmpeg, then re-verify.

## STEP 6: FINAL ASSEMBLY

Call **editing agent** with `hilo_tools_mv_final_assembly`:
- `video_paths`: ALL generated video paths in segment order
- `audio_path`: the ORIGINAL full audio file
- `subtitle_segments`: Build from lyrics timestamps:
  ```json
  [
    {"word": "complete lyric line", "time_begin": 10.5, "time_end": 15.2},
    {"word": "next line", "time_begin": 15.2, "time_end": 20.0}
  ]
  ```
  - Skip instrumental segments ([prelude], [interlude], [outro])
  - `time_begin` and `time_end` in seconds

## STEP 7: PRESENT RESULT

Show the final MV to the user with a summary:
- Audio info (duration, language)
- Script overview (characters, scenes, segment count)
- Final MV path
