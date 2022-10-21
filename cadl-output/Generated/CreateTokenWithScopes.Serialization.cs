// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// <auto-generated/>

#nullable disable

using System.Collections.Generic;
using System.Text.Json;
using Azure;
using Azure.Core;

namespace
{
    public partial class CreateTokenWithScopes : IUtf8JsonSerializable
    {
        void IUtf8JsonSerializable.Write(Utf8JsonWriter writer)
        {
            writer.WriteStartObject();
            if (Optional.IsCollectionDefined(CreateTokenWithScopes))
            {
                writer.WritePropertyName("createTokenWithScopes");
                writer.WriteStartArray();
                foreach (var item in CreateTokenWithScopes)
                {
                    writer.WriteStringValue(item);
                }
                writer.WriteEndArray();
            }
            if (Optional.IsDefined(ExpiresInMinutes))
            {
                if (ExpiresInMinutes != null)
                {
                    writer.WritePropertyName("expiresInMinutes");
                    writer.WriteNumberValue(ExpiresInMinutes.Value);
                }
                else
                {
                    writer.WriteNull("expiresInMinutes");
                }
            }
            writer.WriteEndObject();
        }

        internal static global::.CreateTokenWithScopes DeserializeCreateTokenWithScopes(JsonElement element)
        {
            Optional<IList<string>> createTokenWithScopes = default;
            Optional<int?> expiresInMinutes = default;
            foreach (var property in element.EnumerateObject())
            {
                if (property.NameEquals("createTokenWithScopes"))
                {
                    if (property.Value.ValueKind == JsonValueKind.Null)
                    {
                        property.ThrowNonNullablePropertyIsNull();
                        continue;
                    }
                    List<string> array = new List<string>();
                    foreach (var item in property.Value.EnumerateArray())
                    {
                        array.Add(item.GetString());
                    }
                    createTokenWithScopes = array;
                    continue;
                }
                if (property.NameEquals("expiresInMinutes"))
                {
                    if (property.Value.ValueKind == JsonValueKind.Null)
                    {
                        expiresInMinutes = null;
                        continue;
                    }
                    expiresInMinutes = property.Value.GetInt32();
                    continue;
                }
            }
            return new global::.CreateTokenWithScopes(Optional.ToList(createTokenWithScopes), Optional.ToNullable(expiresInMinutes));
        }

        /// <summary> Deserializes the model from a raw response. </summary>
        /// <param name="response"> The response to deserialize the model from. </param>
        internal static global::.CreateTokenWithScopes FromResponse(Response response)
        {
            using var document = JsonDocument.Parse(response.Content);
            return DeserializeCreateTokenWithScopes(document.RootElement);
        }

        /// <summary> Convert into a Utf8JsonRequestContent. </summary>
        internal virtual RequestContent ToRequestContent()
        {
            var content = new Utf8JsonRequestContent();
            content.JsonWriter.WriteObjectValue(this);
            return content;
        }
    }
}
