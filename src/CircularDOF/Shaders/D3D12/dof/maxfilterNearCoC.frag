struct VSOutput 
{
	float4 Position	: SV_POSITION;
    float2 UV		: TEXCOORD0;
};

SamplerState	samplerLinear	: register(s0);
Texture2D		NearCoCTexture	: register(t0, UPDATE_FREQ_PER_FRAME);

struct PSOut
{
    float FilteredNearCoC : SV_Target0;
};

#define RADIUS 3

PSOut main(VSOutput input) : SV_TARGET
{
	PSOut output;
	
	uint w, h;
	NearCoCTexture.GetDimensions(w, h);
	float2 step = 1.0f / float2(w, h);

	float near = NearCoCTexture.Sample(samplerLinear, input.UV).r;
	
	for(int i = 0; i <= RADIUS * 2; ++i)
	{
		int index = (i - RADIUS);

		float2 coords;

		if(HORIZONTAL)
		{
			coords = input.UV + step * float2(float(index), 0.0);
		}
		else
		{
			coords = input.UV + step * float2(0.0, float(index));
		}

        float sample = NearCoCTexture.Sample(samplerLinear, coords).r;  
		output.FilteredNearCoC = max(output.FilteredNearCoC, sample);
	}

    return output;
}