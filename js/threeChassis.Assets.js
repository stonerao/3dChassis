var _Assets = {
	halo:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAHCAYAAABgOO8AAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkRDQkJBNzRCOTBFMTFFOTg3QThENDUwREM3NUYwNzMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkRDQkJBNzNCOTBFMTFFOTg3QThENDUwREM3NUYwNzMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowNkE2NEY3NEI5MEUxMUU5ODdBOEQ0NTBEQzc1RjA3MyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowNkE2NEY3NUI5MEUxMUU5ODdBOEQ0NTBEQzc1RjA3MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlrN9x4AAAGBSURBVHjabFNBTgMxDPS027IFSlU4IPVX/AXxCD7CG+DEA5AQRw5w4sAJgQQSUMEwcZxNKKw2ymTseOzEgV2/m8H00f9Y/PclQ6+xK8e5lpptIbwnvJex5RnyodvmYdvSWIsfi38VfhF+0HwnnysjbrT+SiKdRS5VU5uMU8Fe/CyEi2BKKHGzwBrYzpzNBnva5/sxzUGpgYX4tF5pTI3SMKREJ7I/yeVM+LTzbCCSmOSAlJMwC/bqeg+MNnlmLeeYgnDg2iKdRiERe5A535f+Q/kfy+FopNU4n4qfTFGo0TAcHq2uWIVZMdDcd8kRbQUc8m5K88jZcTXKUsiSACNSm0btL5DBInJAMyLwZttFGSEhrY1mZTm5BC5SQt9WVBnHirbM9hqGUwmZclV/2p+1piiK/J0ojMOV5/le4KTLCdlHvIKRRN/k2lyjN34nm5qQk2jM3hvTsBMPYB4NvPCeoy2jF/ejBw+Ee/ktZVMsPst/LZ9HzbfiL5XwuXw+fwQYAPZ2ig3IlomvAAAAAElFTkSuQmCC",
	point:"data:image/png;base64,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"

}